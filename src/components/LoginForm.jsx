import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !password) {
      setError("Nombre y contraseña son requeridos");
      return;
    }

    const res = await login({ name, password });

    if (res.success) {
      Swal.fire({
        title: "Éxito",
        text: "Bienvenido!",
        icon: "success",
      });
      navigate("/");
    } else {
      setError(res.message || "Error desconocido al iniciar sesión");
      console.error("Error de login:", res.message);
      Swal.fire({
        title: "Error",
        text: error.message || "Error",
        icon: "error",
      });
    }
  };

  return (
    <Container className="mt-5 mainSection" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Iniciar sesión
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
