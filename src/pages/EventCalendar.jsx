import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek"; // IMPORT CORRETTO
import getDay from "date-fns/getDay";
import itLocale from "date-fns/locale/it";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";

const locales = {
  "it-IT": itLocale,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  // startOfWeek deve essere una funzione che riceve una Date
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

Modal.setAppElement("#root");

function EventCalendar({ isAdmin = true, user = null }) {
  const [events, setEvents] = useState([
    { title: "Evento di prova", start: new Date(), end: new Date(), id: 1 },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", start: null, end: null });

  const handleSelectSlot = ({ start, end }) => {
    if (!isAdmin) return;
    setNewEvent({ title: "", start, end });
    setSelectedEvent(null);
    setModalIsOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    if (isAdmin) {
      setNewEvent({ ...event });
      setModalIsOpen(true);
    } else {
      setModalIsOpen(true);
    }
  };

  const handleSaveEvent = () => {
    if (!newEvent.title) {
      alert("Inserisci un titolo!");
      return;
    }

    if (selectedEvent) {
      setEvents(events.map((evt) => (evt.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : evt)));
    } else {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
    }
    console.log(newEvent)
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    setEvents(events.filter((evt) => evt.id !== selectedEvent.id));
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const handleJoinEvent = async () => {
    try {
      const res = await fetch("/api/events/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          userId: user?.id,
        }),
      });

      if (!res.ok) throw new Error("Errore server");

      alert(`Hai confermato la partecipazione a: ${selectedEvent.title}`);
    } catch (err) {
      console.error(err);
      alert("Errore durante la registrazione alla partecipazione.");
    } finally {
      setModalIsOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <div style={{ padding: "20px", height: "80vh", overflow: "auto" }}>
      <h2>Calendario Eventi</h2>
      {!isAdmin && <p style={{ color: "gray" }}>Modalità utente: sola lettura (con possibilità di partecipare)</p>}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable={isAdmin}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        messages={{
          next: "Avanti",
          previous: "Indietro",
          today: "Oggi",
          month: "Mese",
          week: "Settimana",
          day: "Giorno",
          agenda: "Agenda",
        }}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setSelectedEvent(null);
        }}
        contentLabel="Gestione Evento"
        style={{
          content: { width: "320px", margin: "auto", padding: "20px" },
        }}
      >
        {isAdmin ? (
          <>
            <h3>{selectedEvent ? "Modifica Evento" : "Nuovo Evento"}</h3>
            <input
              type="text"
              placeholder="Titolo evento"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              style={{ width: "100%", marginBottom: 10 }}
            />
            <div style={{ marginTop: "10px" }}>
              <p>Dal: {newEvent.start ? newEvent.start.toLocaleString() : "-"}</p>
              <p>Al: {newEvent.end ? newEvent.end.toLocaleString() : "-"}</p>
            </div>

            <div style={{ marginTop: 12 }}>
              <button onClick={handleSaveEvent} style={{ marginRight: "10px" }}>
                Salva
              </button>

              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  style={{ marginRight: "10px", color: "red" }}
                >
                  Elimina
                </button>
              )}

              <button onClick={() => { setModalIsOpen(false); setSelectedEvent(null); }}>Annulla</button>
            </div>
          </>
        ) : (
          <>
            <h3>{selectedEvent?.title}</h3>
            <p>
              Dal: {selectedEvent?.start?.toLocaleString()} <br />
              Al: {selectedEvent?.end?.toLocaleString()}
            </p>
            <div style={{ marginTop: 12 }}>
              <button onClick={handleJoinEvent} style={{ marginRight: "10px" }}>
                Partecipa
              </button>
              <button onClick={() => { setModalIsOpen(false); setSelectedEvent(null); }}>Chiudi</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default EventCalendar;