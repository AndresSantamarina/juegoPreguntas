// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  const res = await login({ name, password }); // ✅ esta función ya hace la llamada al backend

  if (res.success) {
    navigate("/dashboard");
  } else {
    setError(res.message);
  }
};

  return (
    <Container className="mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Iniciar sesión
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
