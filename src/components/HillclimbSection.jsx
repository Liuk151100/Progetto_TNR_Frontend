import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";

export default function HillclimbSection() {
    // Lista delle immagini presenti nella cartella assets
    const images = [
        "./src/assets/HillClimbSection/N5N_0405.jpg",
        "./src/assets/HillClimbSection/N5N_0266.jpg",
        "./src/assets/HillClimbSection/N5N_0427.jpg",
        "./src/assets/HillClimbSection/NI5_6177.jpg",
        "./src/assets/HillClimbSection/NI5_8193.jpg",
    ];

    const [currentImage, setCurrentImage] = useState(images[0]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Aggiorna la dimensione della finestra per il responsive
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Cambia immagine ogni 2 secondi in modo casuale
    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * images.length);
            setCurrentImage(images[randomIndex]);
        }, 2000);
        return () => clearInterval(interval);
    }, [images]);

    // Gestione responsive
    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1200;
    return (
        <Container
            fluid
            style={{
                padding: 0,
                margin: 0,
                height: "100vh",
               overflow: "hidden",
               boxSizing: "border-box",
                border: "3px solid white"
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100vh",
                    backgroundImage: `url(${currentImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    transition: "background-image 1s ease-in-out",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.45)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: isMobile ? "center" : "flex-start",
                        textAlign: isMobile ? "center" : "left",
                        paddingLeft: isMobile ? "5%" : isTablet ? "8%" : "10%",
                        paddingRight: isMobile ? "5%" : "0",
                        transition: "all 0.3s ease",
                    }}
                >
                    <h1
                        style={{
                            color: "white",
                            fontSize: isMobile ? "2.2rem" : isTablet ? "3rem" : "4rem",
                            fontWeight: "700",
                            letterSpacing: "2px",
                            marginBottom: "1rem",
                            fontFamily: "'Roboto Condensed', sans-serif",
                            textTransform: "uppercase",
                        }}
                    >
                        Hillclimb Races
                    </h1>

                    <p
                        style={{
                            color: "white",
                            width: isMobile ? "90%" : isTablet ? "70%" : "50%",
                            fontSize: isMobile ? "1rem" : "1.1rem",
                            lineHeight: "1.6",
                            marginBottom: "2rem",
                            fontFamily: "'Open Sans', sans-serif",
                        }}
                    >
                        Campionati interessati: C.I.V.M. (Campionato Italiano Velocità Montagna)
                    </p>

                    {/* <Button
                        variant="light"
                        style={{
                            padding: isMobile ? "0.6rem 1.5rem" : "0.75rem 2rem",
                            fontSize: isMobile ? "0.9rem" : "1rem",
                            fontWeight: "600",
                            borderRadius: "30px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        Read More
                    </Button> */}
                </div>
            </div>
        </Container>
    );
}