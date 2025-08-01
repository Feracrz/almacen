import React from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  return (
    <div className="vh-100">
      <Row className="h-100 g-0">
        {/* Columna de imagen */}
        <Col md={7} className="d-none d-md-block">
          <div
            style={{
              backgroundImage: `url(../../../public/recurso.jpg)`, // Tu imagen aquí
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
            }}
          ></div>
        </Col>

        {/* Columna de login */}
        <Col
          md={5}
          className="d-flex justify-content-center align-items-center bg-light"
        >
          <Card
            className="p-4 shadow"
            style={{
              width: "90%",
              maxWidth: "420px",
              borderRadius: "16px",
            }}
          >
            <div className="text-center mb-4">
              <img
                src="../../../public/logo.jpg" 
                style={{ width: "80px" }}
              />
              <h4 className="mt-3 fw-bold">Bienvenido de nuevo</h4>
              <p className="text-muted">Inicia sesión en tu cuenta</p>
            </div>

            {/* Formulario */}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Usuario</Form.Label>
                <Form.Control type="text" placeholder="ferCruz" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Contraseña</Form.Label>
                <Form.Control type="password" placeholder="••••••••" />
              </Form.Group>

             

              <Button
                variant="primary"
                className="w-100 fw-bold"
                style={{ background: "#2e659e", border: "none" }}
              >
                Ingresar
              </Button>
            </Form>

       
          </Card>
        </Col>
      </Row>
    </div>
  );
}