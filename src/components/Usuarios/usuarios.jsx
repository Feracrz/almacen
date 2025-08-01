import React, { useState } from "react";
import { Table, Button, Modal, Form, InputGroup, Alert } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Catálogo de areas de adscripción
  const areasCatalogo = [
    "Administración",
    "Recursos Humanos",
    "Jurídico",
    "Sistemas",
    "Finanzas",
    "Planeación",
    "Comunicación Social",
  ];

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellidos: "",
    area: areasCatalogo[0],
    usuario: "",
    contrasena: "",
    estatus: "Activo",
  });

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    // Validación manual
    if (
      !nuevoUsuario.nombre.trim() ||
      !nuevoUsuario.apellidos.trim() ||
      !nuevoUsuario.area.trim() ||
      !nuevoUsuario.usuario.trim() ||
      !nuevoUsuario.contrasena.trim()
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");

    if (editingIndex !== null) {
      const updated = [...usuarios];
      updated[editingIndex] = nuevoUsuario;
      setUsuarios(updated);
      setEditingIndex(null);
    } else {
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    setNuevoUsuario({
      nombre: "",
      apellidos: "",
      area: areasCatalogo[0],
      usuario: "",
      contrasena: "",
      estatus: "Activo",
    });
    setShowModal(false);
  };

  const handleEditar = (index) => {
    setNuevoUsuario(usuarios[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleEliminar = (index) => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      const updated = usuarios.filter((_, i) => i !== index);
      setUsuarios(updated);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Usuarios</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Agregar Usuario
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Área</th>
            <th>Usuario</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, index) => (
            <tr key={index}>
              <td>{u.nombre}</td>
              <td>{u.apellidos}</td>
              <td>{u.area}</td>
              <td>{u.usuario}</td>
              <td>{u.estatus}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditar(index)}>
                  Editar
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleEliminar(index)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/*modalirri*/}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingIndex !== null ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={nuevoUsuario.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                name="apellidos"
                value={nuevoUsuario.apellidos}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Área de Adscripción</Form.Label>
              <Form.Control
                as="select"
                name="area"
                value={nuevoUsuario.area}
                onChange={handleChange}
                required
              >
                {areasCatalogo.map((area, idx) => (
                  <option key={idx} value={area}>
                    {area}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                name="usuario"
                value={nuevoUsuario.usuario}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="contrasena"
                  value={nuevoUsuario.contrasena}
                  onChange={handleChange}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BsEyeSlash /> : <BsEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Estatus</Form.Label>
              <Form.Control
                as="select"
                name="estatus"
                value={nuevoUsuario.estatus}
                onChange={handleChange}
                required
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionUsuarios;