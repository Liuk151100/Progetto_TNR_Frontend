import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound(){
  return (
    <Container className="text-center" style={{height:"80vh", boxSizing: "border-box", display: "flex", flexDirection:"column", justifyContent:"center", alignItems: "center"}}>
      <h1 className="display-4">404</h1>
      <p className="lead">Oops! This page does not exist.</p>
      <Link to="/" className="btn btn-secondary" style={{width:"170px"}}>
        Torna alla Home
      </Link>
    </Container>
  );
}

export default NotFound; 