import { useState } from "react";
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
} from "react-bootstrap-icons";
import axios from "axios";

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@example.com",
    dataDiNascita: "1990-05-12",
    avatar:
      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
    ruolo: "Pilota",
    categoria: "GT3",
    docPersonali: [
      "https://example.com/cv.pdf",
      "https://example.com/licenza-fia.pdf",
    ],
  });

  const [newDoc, setNewDoc] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    try {
      // esempio chiamata API
      // await axios.put(`/api/users/${user._id}`, user);
      console.log("Dati aggiornati:", user);
      setEditMode(false);
    } catch (err) {
      console.error("Errore nel salvataggio:", err);
    }
  };

  const handleAddDoc = () => {
    if (newDoc.trim() !== "") {
      setUser({ ...user, docPersonali: [...user.docPersonali, newDoc] });
      setNewDoc("");
    }
  };

  return (
    <div className="profile-bg" style={{height: editMode ? "100vh" : "80vh"}}>
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
                    src={user.avatar}
                    roundedCircle
                    width={160}
                    height={160}
                    alt="Avatar utente"
                    className="shadow avatar-img"
                  />
                </div>
                <h5 className="mt-3 text-light fw-bold">
                  {user.nome} {user.cognome}
                </h5>

                <Badge bg="danger" className="me-2">
                  {user.ruolo}
                </Badge>
                <Badge bg="secondary">{user.categoria}</Badge>

                {editMode && (
                  <InputGroup className="mt-3">
                    <Form.Control
                      type="text"
                      placeholder="Nuovo URL avatar"
                      name="avatar"
                      value={user.avatar}
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
                          value={user.nome}
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
                          value={user.cognome}
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
                          value={user.email}
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
                          value={user.dataDiNascita}
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
            <h5 className="text-light mb-3">
              <PersonFill className="me-2" />
              Documenti Personali
            </h5>

            <ListGroup className="mb-3">
              {user.docPersonali.map((doc, idx) => (
                <ListGroup.Item key={idx} className="bg-dark text-light border-secondary">
                  <a href={doc} target="_blank" rel="noopener noreferrer" className="fw-semibold">
                    {doc}
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>

            {editMode && (
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Aggiungi URL documento"
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                />
                <Button variant="danger" onClick={handleAddDoc}>
                  <PlusCircle className="me-1" /> Aggiungi
                </Button>
              </InputGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile;

