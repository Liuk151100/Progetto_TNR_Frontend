import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import itLocale from "date-fns/locale/it";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import { useAuthContext } from "../contexts/authContext";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosInstance from "../../data/axios";

const locales = { "it-IT": itLocale };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

Modal.setAppElement("#root");

function EventCalendar() {
  const { token, loggedUser } = useAuthContext();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ titolo: "", start: null, end: null, luogo: "" });
  const [view, setView] = useState("month");
  const [isAdmin, setIsAdmin] = useState(false);
  const [listaPartecipanti, setListaPartecipanti] = useState([]);
  const [modifyEvent, setModifyEvent] = useState(true);

  // --- Controllo admin
  useEffect(() => {
    if (token && loggedUser) {
      setIsAdmin(loggedUser.ruolo === "admin");
    }
  }, [token, loggedUser]);

  // --- Fetch eventi
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/events");
        const formattedEvents = res.data.map(evt => ({
          ...evt,
          start: new Date(evt.start),
          end: new Date(evt.end),
        }));
        setEvents(formattedEvents);
        setModifyEvent(false);
      } catch (err) {
        console.error(err);
        alert("Errore durante il recupero degli eventi.");
      }
    };
    if (modifyEvent) fetchEvents();
  }, [modifyEvent]);

  // --- Fetch partecipanti quando selectedEvent cambia
  useEffect(() => {
    if (!selectedEvent?.partecipanti || selectedEvent.partecipanti.length === 0) {
      setListaPartecipanti([]);
      return;
    }

    const fetchPartecipanti = async () => {
      try {
        const promises = selectedEvent.partecipanti.map(async (id) => {
          const res = await axiosInstance.get(`/users/${id}`);
          return { nome: res.data.nome, cognome: res.data.cognome };
        });
        const users = await Promise.all(promises);
        setListaPartecipanti(users);
      } catch (err) {
        console.error("Errore nel recupero dei partecipanti:", err);
        setListaPartecipanti([]);
      }
    };

    fetchPartecipanti();
  }, [selectedEvent]);

  // --- Handle selezione slot (admin)
  const handleSelectSlot = ({ start, end }) => {
    if (!isAdmin) return;
    setNewEvent({ titolo: "", start, end, luogo: "" });
    setSelectedEvent(null);
    setModalIsOpen(true);
  };

  // --- Handle selezione evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    if (isAdmin) setNewEvent({ ...event });
    setModalIsOpen(true);
  };

  // --- Salvataggio evento
  const handleSaveEvent = () => {
    if (!newEvent.titolo) {
      alert("Inserisci un titolo!");
      return;
    }
    if (selectedEvent) {
      setEvents(events.map(evt =>
        evt._id === selectedEvent._id ? { ...newEvent, _id: selectedEvent._id } : evt
      ));
    } else {
      setEvents([...events, { ...newEvent, _id: Date.now() }]);
    }
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  // --- Eliminazione evento
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await axiosInstance.delete(`/events/${selectedEvent._id}`);
      setEvents(events.filter(evt => evt._id !== selectedEvent._id));
      setModalIsOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error(err);
      alert("Errore durante la cancellazione dell'evento.");
    }
  };

  // --- Partecipazione utente
  const handleJoinEvent = async () => {
    if (!loggedUser?._id) return alert("Devi effettuare il login");
    try {
      await axiosInstance.patch(`/events/${selectedEvent._id}/join`, { userId: loggedUser._id });
      setModifyEvent(true);
      alert(`Hai confermato la partecipazione a: ${selectedEvent.titolo}`);
    } catch (err) {
      console.error(err);
      alert("Errore durante la registrazione alla partecipazione.");
    } finally {
      setModalIsOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <div style={{ padding: "20px", height: "80vh", maxHeight: "80vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <h2 className="text-center mb-3">Calendario Eventi</h2>
      {!isAdmin && <p className="text-center text-muted">Modalità utente: sola lettura (con possibilità di partecipare)</p>}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "900px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="titolo"
            view={view}
            onView={(newView) => setView(newView)}
            toolbar={true}
            style={{ width: "100%", minHeight: "500px", borderRadius: "10px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            selectable={isAdmin && !modalIsOpen}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            messages={{ next: "Avanti", previous: "Indietro", today: "Oggi", month: "Mese", week: "Settimana", day: "Giorno", agenda: "Agenda" }}
          />
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => { setModalIsOpen(false); setSelectedEvent(null); }}
        contentLabel="Gestione Evento"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9999 },
          content: { width: "320px", maxWidth: "90vw", padding: "20px", borderRadius: "12px", backgroundColor: "white", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10000 }
        }}
      >
        {isAdmin ? (
          <>
            <h3>{selectedEvent ? "Modifica Evento" : "Nuovo Evento"}</h3>
            <input type="text" placeholder="Titolo evento" value={newEvent.titolo} onChange={e => setNewEvent({ ...newEvent, titolo: e.target.value })} style={{ width: "100%", marginBottom: 10 }} />
            <input type="text" placeholder="Luogo evento" value={newEvent.luogo} onChange={e => setNewEvent({ ...newEvent, luogo: e.target.value })} style={{ width: "100%", marginBottom: 10 }} />
            <p>Dal: {newEvent.start?.toLocaleString() || "-"}<br />Al: {newEvent.end?.toLocaleString() || "-"}</p>
            <div style={{ marginTop: 12 }}>
              <button onClick={handleSaveEvent} style={{ marginRight: "10px" }}>Salva</button>
              {selectedEvent && <button onClick={handleDeleteEvent} style={{ marginRight: "10px", color: "red" }}>Elimina</button>}
              <button onClick={() => { setModalIsOpen(false); setSelectedEvent(null); }}>Annulla</button>
            </div>
          </>
        ) : (
          <>
            <h3>{selectedEvent?.titolo}</h3>
            <p>
              Dal: {selectedEvent?.start?.toLocaleString()} <br />
              Al: {selectedEvent?.end?.toLocaleString()} <br />
              Luogo: {selectedEvent?.luogo} <br />
            </p>
            <div>
              Partecipanti: {listaPartecipanti.length > 0 ? (
                <ul>{listaPartecipanti.map((p, idx) => <li key={idx}>{p.nome} {p.cognome}</li>)}</ul>
              ) : <span>Nessun partecipante</span>}
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={handleJoinEvent} disabled={!loggedUser} style={{ marginRight: "10px" }}>Partecipa</button>
              <button onClick={() => { setModalIsOpen(false); setSelectedEvent(null); }}>Chiudi</button>
              {!loggedUser && (
                <div className="alert alert-danger my-3 text-center">
                  Effettua il login per dare la conferma di partecipazione
                  <Button variant="dark" size="md" as={Link} to="/Login" className="me-3 fw-bold my-3" style={{ borderRadius: "20px" }}>Login</Button>
                </div>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default EventCalendar;