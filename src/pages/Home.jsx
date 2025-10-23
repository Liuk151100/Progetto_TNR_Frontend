import { Container } from "react-bootstrap";
import HillclimbSection from "../components/HillclimbSection";
import KartSection from "../components/KartSection";
import LegendsSection from "../components/LegendsSection";
import TeamSection from "../components/TeamSection";
import ContactUs from "../components/ContactUs";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {


  const location = useLocation();
  const navigate = useNavigate()

  if (location.state?.scrollTo === "team") {
    setTimeout(() => {
      window.scrollTo({ top: 2600, behavior: "smooth" });
    }, 500);
    navigate("/",{ state: undefined })

  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [])

  return (
    <>
      <KartSection />
      <LegendsSection />
      <HillclimbSection />
      <TeamSection />
      <ContactUs />
    </>
  );
}