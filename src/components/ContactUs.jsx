import { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axiosInstance from "../../data/axios";

export default function ContactUs() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(""); // stato per il testo
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validazione semplice dell'email

        if (!emailRegex.test(email)) {
            setError("Inserisci una email valida.");
            return;
        }

        // Validazione del messaggio
        if (!message.trim()) {
            setError("Inserisci un messaggio.");
            return;
        }

        try {
            const response = await axiosInstance.post("/contacts/contactUs", {
                email,
                message,
            });

            if (response.status === 200) {
                setSubmitted(true);
                setEmail("");
                setMessage("");
            } else {
                setError(response.data.error || "Si è verificato un errore.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Errore di connessione al server.");
        }

        setError("");
        setSubmitted(true);

        // Qui andrà la logica per inviare l'email al backend
        console.log("Email inviata:", email);
        console.log("Messaggio:", message);

        // Pulire i campi dopo l'invio
        setEmail("");
        setMessage("");
    };

    return (
        <section className="contactSection py-5">
            <Container>
                <h2 className="text-center mb-5 fw-bold section-title">
                    Contattaci
                </h2>
                <div className="mt-4">
                    {submitted && <Alert variant="success">Email inviata con successo!</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Inserisci la tua email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="esempio@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={!!error && !emailRegex.test(email)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formMessage" className="mt-3">
                            <Form.Label>Messaggio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Scrivi il tuo messaggio..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                isInvalid={!!error && !message.trim()}
                            />
                        </Form.Group>

                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                        <Button variant="primary" type="submit" className="mt-3">
                            Invia
                        </Button>
                    </Form>
                </div>
            </Container>
        </section>
    );
}