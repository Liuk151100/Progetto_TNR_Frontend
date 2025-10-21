import { useContext, useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Image,
    ListGroup,
    InputGroup,
    Badge,
} from "react-bootstrap";
import {
    PencilSquare,
    CheckCircle,
    PlusCircle,
    Upload,
    Speedometer2,
    PersonFill,
    Border,
} from "react-bootstrap-icons";
import axios from "axios";
import axiosInstance from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";

const UserProfile = () => {
    const [editMode, setEditMode] = useState(false);

    const [user, setUser] = useState(null);
    const { loggedUser } = useAuthContext();
    var nextRequest

    useEffect(() => {
        if (loggedUser) {

            setUser({
                nome: loggedUser.nome,
                cognome: loggedUser.cognome,
                email: loggedUser.email,
                dataDiNascita: loggedUser.dataDiNascita,
                avatar: loggedUser?.avatar,
                ruolo: loggedUser.ruolo,
                categoria: loggedUser.categoria,
                docPersonali: loggedUser.docPersonali || [],
            });
        }
    }, [loggedUser]);


    const [newDoc, setNewDoc] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("nome", user.nome);
            formData.append("cognome", user.cognome);
            formData.append("email", user.email);
            formData.append("dataDiNascita", user.dataDiNascita);
            formData.append("avatar", user.avatar);

            await axiosInstance.patch(`/users/avatar/${loggedUser?._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Dati aggiornati 1:", user);
            setEditMode(false);
            nextRequest = true
        } catch (err) {
            console.error("Errore nel salvataggio:", err);
        }

        if (nextRequest == true) {
            try {
                const formData = new FormData();
                formData.append("nome", user.nome);
                formData.append("cognome", user.cognome);
                formData.append("email", user.email);
                user.docPersonali.forEach((doc) => {
                    if (doc instanceof File) {
                        formData.append("docPersonali", doc);
                    }
                });

                await axiosInstance.patch(`/users/docPersonali/${loggedUser?._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                console.log("Dati aggiornati 2:", user);
                setEditMode(false);
                window.location.reload();
            } catch (err) {
                console.error("Errore nel salvataggio:", err);
            }
        }
    };

    const handleAddDoc = (e) => {
        const { name, files } = e.target;
        const newFiles = Array.from(files);

        setUser((prevUser) => ({
            ...prevUser,
            [name]: [...(prevUser[name] || []), ...newFiles],
        }));
    };

    return (
        <div className="profile-bg" style={{ height: editMode ? "100vh" : "80vh" }}>
            <Container className="py-4">
                <Card className="shadow-lg profile-card">
                    <Card.Header className="d-flex justify-content-between align-items-center profile-header">
                        <div className="d-flex align-items-center gap-2">
                            <Speedometer2 size={26} />
                            <h4 className="mb-0 fw-bold text-uppercase">Profilo Utente</h4>
                        </div>
                        {editMode ? (
                            <Button variant="success" onClick={handleSave} className="fw-bold">
                                <CheckCircle className="me-2" />
                                Salva
                            </Button>
                        ) : (
                            <Button
                                variant="danger"
                                onClick={() => setEditMode(true)}
                                className="fw-bold"
                            >
                                <PencilSquare className="me-2" />
                                Modifica
                            </Button>
                        )}
                    </Card.Header>

                    <Card.Body>
                        <Row className="align-items-center mb-4">
                            <Col md={3} className="text-center">
                                <div className="avatar-wrapper mx-auto">
                                    <Image
                                        src={user?.avatar}
                                        roundedCircle
                                        width={160}
                                        height={160}
                                        alt="Avatar utente"
                                        className="shadow avatar-img"
                                    />
                                </div>
                                <h5 className="mt-3 text-light fw-bold">
                                    {user?.nome} {user?.cognome}
                                </h5>

                                <Badge bg="danger" className="me-2">
                                    {user?.ruolo}
                                </Badge>
                                <Badge bg="secondary">{user?.categoria}</Badge>

                                {editMode && (
                                    <InputGroup className="mt-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Nuovo URL avatar"
                                            name="avatar"
                                            value={user?.avatar}
                                            onChange={handleChange}
                                        />
                                        <Button variant="outline-light">
                                            <Upload />
                                        </Button>
                                    </InputGroup>
                                )}
                            </Col>

                            <Col md={9}>
                                <Form className="text-light">
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Nome</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="nome"
                                                    value={user ? user.nome : "nome"}
                                                    onChange={handleChange}
                                                    disabled={!editMode}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Cognome</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="cognome"
                                                    value={user ? user.cognome : "cognome"}
                                                    onChange={handleChange}
                                                    disabled={!editMode}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={user ? user.email : "email"}
                                                    onChange={handleChange}
                                                    disabled={!editMode}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Data di Nascita</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="dataDiNascita"
                                                    value={user ? user.dataDiNascita : "1999-01-01"}
                                                    onChange={handleChange}
                                                    disabled={!editMode}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>

                        <hr className="border-danger opacity-75" />
                        <h5 className="mb-3">
                            <PersonFill className="me-2" />
                            Documenti Personali
                        </h5>
                        <hr className="border-danger opacity-75" />
                        {user?.docPersonali.lenght > 0 ?
                            <ListGroup>
                                {user?.docPersonali.map((doc, idx) => (
                                    <ListGroup.Item key={idx}>
                                        {doc instanceof File ? doc.name : <a href={doc} target="_blank" rel="noreferrer">{doc}</a>}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            : <h3>Nessun documento caricato</h3>}
                        {editMode && (
                            <Form.Group controlId="formFileMultiple" className="mb-3">
                                <Form.Label>Documenti personali</Form.Label>
                                <Form.Control type="file" multiple name="docPersonali" onChange={handleAddDoc} />
                            </Form.Group>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default UserProfile;

