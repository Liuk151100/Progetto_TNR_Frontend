import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { FileEarmarkPdf, Paperclip, Send } from "react-bootstrap-icons";
import axiosInstance from "../../data/axios";

const Safeguarding = () => {

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        messaggio: "",
        files: [],
    });

    const [alert, setAlert] = useState({ show: false, variant: "", text: "" });
    const [sending, setSending] = useState(false);


    // Lista di documenti disponibili
    const documents = [
        {
            title: "1. MODULO ACCETTAZIONE_TESSERATO_MODULISTICA_ACI",
            file: "/DocSafeguarding/1. MODULO ACCETTAZIONE_TESSERATO_MODULISTICA_ACI.pdf",
        },
        {
            title: "2. MODELLO ORGANIZZATIVO_TEAM NEW RACING definitivo",
            file: "/DocSafeguarding/2. MODELLO ORGANIZZATIVO_TEAM NEW RACING definitivo.pdf",
        },
        {
            title: "3. CODICE-DI-CONDOTTA_TEAM NEW RACING definitivo",
            file: "/DocSafeguarding/3. CODICE-DI-CONDOTTA_TEAM NEW RACING definitivo.pdf",
        },
        {
            title: "4.003-24 Verbale Assemblea Safeguarding - TEAM NEW RACING_firmato",
            file: "/DocSafeguarding/4.003-24 Verbale Assemblea Safeguarding - TEAM NEW RACING_firmato.pdf",
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, files: Array.from(e.target.files) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            // Costruzione del FormData per invio file
            console.log(formData)
            const form = new FormData();
            form.append("nome", formData.nome);
            form.append("email", formData.email);
            form.append("messaggio", formData.messaggio);
            formData.files.forEach((file) => form.append("allegati", file));
            console.log(form)

            await axiosInstance.post("/safeguarding", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setAlert({
                show: true,
                variant: "success",
                text: "Segnalazione inviata correttamente! Ti ricontatteremo al più presto.",
            });

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error(error);
            setAlert({
                show: true,
                variant: "danger",
                text: "Errore durante l'invio. Riprova più tardi.",
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-5 fw-bold text-uppercase">
                Safeguarding e Documenti
            </h2>

            {/* SEZIONE DOCUMENTI */}
            <div className="d-flex flex-column align-items-center">

                {documents.map((doc, index) => (
                    <Row className="mb-5" key={index} style={{ width: "80%" }}>
                        <Card className="shadow-sm h-100 border-0 rounded-3">
                            <Card.Body className="d-flex flex-raw justify-content-between" style={{ width: "100%" }}>
                                <div className="d-flex flex-raw align-items-center">
                                    <FileEarmarkPdf size={40} className="text-danger mb-3" />
                                    <h5 style={{ marginLeft: "10px", height: "30px", lineHeight: "30px" }}>{doc.title}</h5>
                                </div>
                                <Button
                                    variant="outline-danger"
                                    href={doc.file}
                                    download
                                    className="fw-bold"
                                    style={{ height: "40px", lineHeight: "40px", textAlign: "center", boxSizing: "content-box" }}
                                >
                                    Scarica PDF
                                </Button>
                            </Card.Body>
                        </Card>
                    </Row>
                ))}

            </div>

            {/* SEZIONE SEGNALAZIONE */}
            <Card className="shadow-lg border-0 rounded-4 p-4 mx-auto" style={{ maxWidth: "700px" }}>
                <Card.Body>
                    <h4 className="fw-bold mb-4 text-center">
                        Invia una Segnalazione
                    </h4>

                    {alert.show && (
                        <Alert
                            variant={alert.variant}
                            onClose={() => setAlert({ show: false })}
                            dismissible
                        >
                            {alert.text}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Inserisci il tuo nome"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Inserisci la tua email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Messaggio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                name="messaggio"
                                value={formData.messaggio}
                                onChange={handleChange}
                                placeholder="Descrivi la tua segnalazione..."
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Allega file</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                            {formData.files.length > 0 && (
                                <ul className="mt-2 small text-muted">
                                    {formData.files.map((file, idx) => (
                                        <li key={idx}>
                                            <Paperclip size={14} className="me-1" />
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form.Group>

                        <div className="text-center">
                            <Button
                                type="submit"
                                variant="danger"
                                className="fw-bold px-4 py-2 rounded-pill"
                                disabled={sending}
                            >
                                <Send className="me-2" />
                                {sending ? "Invio in corso..." : "Invia Segnalazione"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Safeguarding;