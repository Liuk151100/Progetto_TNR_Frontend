
import { useEffect, useState } from "react";
import axiosInstance from "../../data/axios";
import { Card, Col, Container, Row } from "react-bootstrap";

export default function TeamSection() {
    const [pilots, setPilots] = useState([]);

    async function getPilots() {
        try {
            const pilots = await axiosInstance.get("/users");
            console.log(pilots.data)
            const pilotsFiltered = pilots.data.filter(u => u.ruolo !== "Visitor")
            console.log(pilotsFiltered)
            setPilots(pilotsFiltered);
        } catch (e) {
            console.log(`axios get users ${e}`);
        }
    }

    useEffect(() => {
        getPilots();
    }, []);

    return (
        <section className="team-section py-5">
            <Container>
                <h2 className="text-center mb-5 fw-bold section-title">
                    Team
                </h2>

                <Row className="g-4 justify-content-center">
                    {pilots.map((pilot) => (
                        <Col
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={pilot._id}
                            className="d-flex justify-content-center"
                        >
                            <Card className="pilot-card shadow-sm">
                                <div className="pilot-img-wrapper">
                                    <Card.Img
                                        variant="top"
                                        src={pilot.avatar || "/placeholder.jpg"}
                                        alt={`${pilot.nome} ${pilot.cognome}`}
                                        className="pilot-img"
                                    />
                                </div>
                                <Card.Body className="text-center">
                                    <Card.Title className="fw-bold text-uppercase text-dark">
                                        {pilot.nome} {pilot.cognome}
                                    </Card.Title>
                                    <Card.Text>
                                        {pilot.dataDiNascita}
                                    </Card.Text>
                                    <Card.Text>
                                        {`${pilot.ruolo} ${pilot.categoria}`}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
}
