import { Container } from "react-bootstrap";
import { Form } from "react-router-dom";

export default function ContactUs() {

    return (
        <>
            <section className="contactSection py-5">
                <Container>
                    <h2 className="text-center mb-5 fw-bold section-title">
                        Contatti
                    </h2>
                     {/* <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Messaggio</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder= "Scrivi qui il tuo messaggio"/>
                        </Form.Group>
                    </Form>  */}
                </Container>
            </section>
        </>
    );
}