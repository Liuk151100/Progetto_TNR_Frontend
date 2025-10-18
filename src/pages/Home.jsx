import { Container } from "react-bootstrap";
import HillclimbSection from "../components/HillclimbSection";
import KartSection from "../components/KartSection";
import LegendsSection from "../components/LegendsSection";
import TeamSection from "../components/TeamSection";
import ContactUs from "../components/ContactUs";

export default function Home() {
  

  return (
    <>
    <KartSection/>
    <LegendsSection/>
    <HillclimbSection/>
    <TeamSection/>
    <ContactUs/>
    </>
  );
}