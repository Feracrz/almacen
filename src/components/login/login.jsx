import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow" style={{ maxWidth: "420px", width: "100%", borderRadius: "16px" }}>
        <div className="text-center mb-4">
          <img
            src="https://readme.com/static/images/logo.svg" // Aquí tu logo
            alt="Logo"
            style={{ width: "80px" }}
          />
          <h4 className="mt-3 fw-bold">Iniciar sesión</h4>
          <p className="text-muted">Accede con tu cuenta</p>
        </div>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
            <Form.Control type="email" placeholder="ejemplo@correo.com" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Contraseña</Form.Label>
            <Form.Control type="password" placeholder="••••••••" />
          </Form.Group>

          <div className="d-flex justify-content-between mb-3">
            <Form.Check type="checkbox" label="Recuérdame" />
            <a href="#" className="small text-decoration-none">¿Olvidaste tu contraseña?</a>
          </div>

          <Button variant="primary" className="w-100 fw-bold" style={{ background: "#2e659e", border: "none" }}>
            Ingresar
          </Button>
        </Form>

        <div className="text-center mt-3">
          <p className="small text-muted">
            ¿No tienes cuenta? <a href="#">Regístrate</a>
          </p>
        </div>
      </Card>
    </div>
  );
}