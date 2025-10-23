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
    Alert,
} from "react-bootstrap";
import {
    PencilSquare,
    CheckCircle,
    PlusCircle,
    Upload,
    Speedometer2,
    PersonFill,
    Border,
    FileX,
} from "react-bootstrap-icons";
import axios from "axios";
import axiosInstance from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
    const [editMode, setEditMode] = useState(false);

    const [user, setUser] = useState({
        nome: "",
        cognome: "",
        email: "",
        dataDiNascita: "",
        avatar: "",
        ruolo: "",
        categoria: "",
        docPersonali: [],
    });
    const { loggedUser } = useAuthContext();

    var nextRequest

    // useEffect(() => {
    //     if (loggedUser) {

    //         setUser({
    //             nome: loggedUser.nome,
    //             cognome: loggedUser.cognome,
    //             email: loggedUser.email,
    //             dataDiNascita: loggedUser.dataDiNascita,
    //             avatar: loggedUser?.avatar,
    //             ruolo: loggedUser.ruolo,
    //             categoria: loggedUser.categoria,
    //             docPersonali: loggedUser.docPersonali || [],
    //         });
    //     }
    // }, [loggedUser]);


    const [newDoc, setNewDoc] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState();

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
            formData.append("password", user.password)
            formData.append("dataDiNascita", user.dataDiNascita);
            formData.append("avatar", user.avatar);
            formData.append("ruolo", user.ruolo);
            formData.append("categoria", user.categoria);

            const response = await axiosInstance.post(`/users`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(response)
            setMessage(response.data.message)
            setStatus(response.status)

            setInterval(() => {
                window.location.reload()
            }, 1000);
            
            console.log("Dati aggiornati 1:", user);
        } catch (err) {
            console.error("Errore nel salvataggio:", err);
            console.log(err.response)
            setMessage(err.response.data.message)
            setStatus(err.response.status)
        }
    };


    return (
        <div className="profile-bg" style={{ height: editMode ? "100vh" : "80vh" }}>
            <Container className="py-4">
                <Card className="shadow-lg profile-card">
                    <Card.Header className="d-flex justify-content-between align-items-center profile-header">
                        <div className="d-flex align-items-center gap-2">
                            <Speedometer2 size={26} />
                            <h4 className="mb-0 fw-bold text-uppercase">Nuovo Utente</h4>
                        </div>
                        <Button variant="success" onClick={handleSave} className="fw-bold">
                            <CheckCircle className="me-2" />
                            Salva
                        </Button>
                    </Card.Header>

                    <Card.Body>
                        {message != "" && status >= 400  && <Alert className="bg-danger" style={{color:"black"}}>{message} </Alert>}
                        {message != "" && status >= 200 && status < 400 && <Alert className="bg-success" style={{color:"black"}}>{message} </Alert>}
                        <Row className="align-items-center mb-4">
                            <Col md={3} className="text-center">
                                <div className="avatar-wrapper mx-auto">
                                    <Image
                                        src={user?.avatar || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"}
                                        roundedCircle
                                        width={160}
                                        height={160}
                                        alt="Avatar utente"
                                        className="shadow avatar-img"
                                    />
                                </div>

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
                            </Col>

                            <Col md={9}>
                                <Form>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nome</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="nome"
                                                    value={user ? user.nome : ""}
                                                    onChange={handleChange}
                                                    placeholder="Inserire nome"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Cognome</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="cognome"
                                                    value={user ? user.cognome : ""}
                                                    onChange={handleChange}
                                                    placeholder="Inserire cognome"
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={user ? user.email : ""}
                                                    onChange={handleChange}
                                                    placeholder="Inserire email utente"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="password"
                                                    value={user ? user.password : ""}
                                                    onChange={handleChange}
                                                    placeholder="Inserire una password per primo accesso"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Data di Nascita</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="dataDiNascita"
                                                    value={user ? user?.dataDiNascita : ""}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Ruolo nel Team</Form.Label>
                                                <Form.Select
                                                    name="ruolo"
                                                    value={user ? user.ruolo : ""}
                                                    onChange={handleChange}
                                                    className="shadow-sm rounded-3"
                                                    style={{ maxWidth: "456px", fontSize: "1rem", padding: "0.5rem" }}
                                                >
                                                    <option value="" style={{ fontSize: "0.8rem", width: "10px" }}>Seleziona un ruolo</option>
                                                    <option value="Admin" style={{ fontSize: "0.8rem" }}>👑 Admin</option>
                                                    <option value="Pilota" style={{ fontSize: "0.8rem" }}>🏎️ Pilota</option>
                                                    <option value="Meccanico" style={{ fontSize: "0.8rem" }}>🔧 Meccanico</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Categoria</Form.Label>
                                                <Form.Select
                                                    name="categoria"
                                                    value={user ? user.categoria : ""}
                                                    onChange={handleChange}
                                                    className="shadow-sm rounded-3"
                                                    style={{ maxWidth: "456px", fontSize: "1rem", padding: "0.5rem" }}
                                                >
                                                    <option value="">Seleziona un ruolo</option>
                                                    <option value="Kart">Kart</option>
                                                    <option value="Legend Cars">Legend Cars</option>
                                                    <option value="Hillclimb Cars">Hillclimb Cars</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default CreateUser;

