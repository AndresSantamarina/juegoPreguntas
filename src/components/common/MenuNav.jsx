import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // o useContext si no tenés useAuth

const MenuNav = () => {
  const { user, logout } = useAuth(); // esto accede al usuario autenticado

  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">Juego de Preguntas</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">
                  INICIAR SESIÓN
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  REGISTRARSE
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/">
                  INICIO
                </Nav.Link>
                <Nav.Link as={Link} to="/agregar">
                  AGREGAR
                </Nav.Link>
                <Nav.Link as={Link} to="/preguntas">
                  MODIFICAR
                </Nav.Link>
                <Nav.Link as={Link} to="/jugar">
                  JUGAR
                </Nav.Link>
                <Nav.Link as={Link} to="/" onClick={logout}>
                  CERRAR SESIÓN
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MenuNav;
