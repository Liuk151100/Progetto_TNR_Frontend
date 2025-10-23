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
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [newEvent, setNewEvent] = useState({ titolo: "", start: "", end: "", luogo: "" });
  const [view, setView] = useState("month");
  const [isAdmin, setIsAdmin] = useState(false);
  const [listaPartecipanti, setListaPartecipanti] = useState([]);
  const [modifyEvent, setModifyEvent] = useState(true);

  // --- Controllo admin
  useEffect(() => {
    if (token && loggedUser) {
      setIsAdmin(loggedUser.ruolo === "Admin");
    }
  }, [token, loggedUser]);

  // --- Fetch eventi
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/events");
        const formattedEvents = res.data.map((evt) => ({
          ...evt,
          start: new Date(evt.start),
          end: new Date(evt.end),
        }));
        setEvents(formattedEvents);
        setModifyEvent(false);
      } catch (err) {
        console.error(err);
        setTextAlert("Errore durante il recupero degli eventi.");
        setModal2IsOpen(true)
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

  // --- Utility per formattare Date per input type datetime-local
  const formatDateForInput = (date) => {
    if (!date) return "";
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  // --- Handle selezione slot (admin)
  const handleSelectSlot = ({ start, end }) => {
    if (!isAdmin) return;
    setNewEvent({ titolo: "", start: formatDateForInput(start), end: formatDateForInput(end), luogo: "" });
    setSelectedEvent(null);
    setModalIsOpen(true);
  };

  // --- Handle selezione evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    if (isAdmin) {
      setNewEvent({
        titolo: event.titolo,
        luogo: event.luogo,
        start: formatDateForInput(event.start),
        end: formatDateForInput(event.end),
      });
    }
    setModalIsOpen(true);
  };

  // --- Salvataggio evento
  const handleSaveEvent = async () => {
    if (!newEvent.titolo || !newEvent.start || !newEvent.end || !newEvent.luogo) {
      setTextAlert("Tutti i campi sono obbligatori!");
      setModal2IsOpen(true)
      return;
    }

    const startDate = new Date(newEvent.start);
    const endDate = new Date(newEvent.end);

    try {
      if (selectedEvent) {
        await axiosInstance.patch(`/events/${selectedEvent._id}`, {
          titolo: newEvent.titolo,
          start: startDate,
          end: endDate,
          luogo: newEvent.luogo,
        });
      } else {
        await axiosInstance.post(`/events`, {
          titolo: newEvent.titolo,
          start: startDate,
          end: endDate,
          luogo: newEvent.luogo,
        });
      }

      setModifyEvent(true);
      setModalIsOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error(err);
      setTextAlert("Errore durante il salvataggio dell'evento");
      setModal2IsOpen(true)
    }
  };

  // --- Eliminazione evento
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await axiosInstance.delete(`/events/${selectedEvent._id}`);
      setEvents(events.filter((evt) => evt._id !== selectedEvent._id));
      setModalIsOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error(err);
      setTextAlert("Errore durante la cancellazione dell'evento.");
      setModal2IsOpen(true)
    }
  };

  // --- Partecipazione utente
  const handleJoinEvent = async () => {
    if (!loggedUser?._id) return alert("Devi effettuare il login");
    try {
      const response = await axiosInstance.patch(`/events/${selectedEvent._id}/join`, { userId: loggedUser._id });
      setModifyEvent(true);
      console.log(response)
      setTextAlert(`${response.data.message} a: ${selectedEvent.titolo}`);
      setModal2IsOpen(true)
    } catch (err) {
      console.error(err);
      setTextAlert("Errore durante la registrazione alla partecipazione.");
      setModal2IsOpen(true)
    } finally {
      setModalIsOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        height: "80vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 className="text-center mb-3">Calendario Eventi</h2>
      {!isAdmin && (
        <p className="text-center text-muted">
          Modalità utente: sola lettura (con possibilità di partecipare)
        </p>
      )}

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
            style={{
              width: "100%",
              minHeight: "500px",
              borderRadius: "10px",
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            selectable={isAdmin && !modalIsOpen}
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
        </div>
      </div>

      {/* -------- MODALE STILIZZATA -------- */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setSelectedEvent(null);
        }}
        contentLabel="Gestione Evento"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 },
          content: {
            width: "420px",
            maxWidth: "90vw",
            padding: "24px 28px",
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "none",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          },
        }}
      >
        {isAdmin ? (
          <>
            <h3
              style={{
                textAlign: "center",
                fontWeight: "600",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              {selectedEvent ? "Modifica Evento" : "Nuovo Evento"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                placeholder="Titolo evento"
                value={newEvent.titolo}
                onChange={(e) => setNewEvent({ ...newEvent, titolo: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                placeholder="Luogo evento"
                value={newEvent.luogo}
                onChange={(e) => setNewEvent({ ...newEvent, luogo: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "500", color: "#555" }}>Data inizio:</label>
                <input
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />

                <label style={{ fontWeight: "500", color: "#555" }}>Data fine:</label>
                <input
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "18px" }}>
              <button
                onClick={handleSaveEvent}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  flex: 1,
                  marginRight: "8px",
                  fontWeight: "500",
                }}
              >
                💾 Salva
              </button>

              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    flex: 1,
                    marginRight: "8px",
                    fontWeight: "500",
                  }}
                >
                  🗑️ Elimina
                </button>
              )}

              <button
                onClick={() => {
                  setModalIsOpen(false);
                  setSelectedEvent(null);
                }}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  flex: 1,
                  fontWeight: "500",
                }}
              >
                ✖️ Annulla
              </button>
            </div>

            <div>
              <strong>Partecipanti:</strong>
              {listaPartecipanti.length > 0 ? (
                <ul style={{ marginTop: "8px", marginLeft: "18px" }}>
                  {listaPartecipanti.map((p, idx) => (
                    <li key={idx}>
                      {p.nome} {p.cognome}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#888" }}>Nessun partecipante</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h3
              style={{
                textAlign: "center",
                fontWeight: "600",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              {selectedEvent?.titolo}
            </h3>

            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "10px",
              }}
            >
              <p style={{ margin: 0, color: "#444" }}>
                📅 <strong>Dal:</strong> {selectedEvent?.start?.toLocaleString()}
                <br />
                🕒 <strong>Al:</strong> {selectedEvent?.end?.toLocaleString()}
                <br />
                📍 <strong>Luogo:</strong> {selectedEvent?.luogo}
              </p>
            </div>

            <div>
              <strong>Partecipanti:</strong>
              {listaPartecipanti.length > 0 ? (
                <ul style={{ marginTop: "8px", marginLeft: "18px" }}>
                  {listaPartecipanti.map((p, idx) => (
                    <li key={idx}>
                      {p.nome} {p.cognome}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#888" }}>Nessun partecipante</p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "18px",
              }}
            >
              <button
                onClick={handleJoinEvent}
                disabled={!loggedUser}
                style={{
                  backgroundColor: loggedUser ? "#28a745" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: loggedUser ? "pointer" : "not-allowed",
                  fontWeight: "500",
                }}
              >
                ✅ Partecipa
              </button>

              <button
                onClick={() => {
                  setModalIsOpen(false);
                  setSelectedEvent(null);
                }}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                ✖️ Chiudi
              </button>
            </div>

            {!loggedUser && (
              <div
                className="alert alert-warning mt-3 text-center"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#fff3cd",
                  color: "#856404",
                  padding: "12px",
                }}
              >
                <p style={{ marginBottom: "8px" }}>
                  Effettua il login per partecipare all’evento.
                </p>
                <Button
                  variant="dark"
                  size="md"
                  as={Link}
                  to="/Login"
                  className="fw-bold"
                  style={{ borderRadius: "20px" }}
                >
                  🔐 Login
                </Button>
              </div>
            )}
          </>
        )}
      </Modal>

       {/* -------- MODALE DI AVVISO -------- */}
      <Modal
        isOpen={modal2IsOpen}
        onRequestClose={() => setModal2IsOpen(false)}
        contentLabel="Avviso"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.4)", zIndex: 10000 },
          content: {
            width: "380px",
            maxWidth: "90vw",
            padding: "24px",
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "16px",
          },
        }}
      >
        <h4 style={{ color: "#333", fontWeight: "600" }}>⚠️ Attenzione</h4>
        <p
          style={{
            color: textAlert.toLowerCase().includes("errore") ? "#dc3545" : "#28a745",
            margin: "0",
          }}
        >
          {textAlert}
        </p>

        <button
          onClick={() => setModal2IsOpen(false)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "500",
            marginTop: "10px",
          }}
        >
          OK
        </button>
      </Modal>

    </div>
  );
}

export default EventCalendar;