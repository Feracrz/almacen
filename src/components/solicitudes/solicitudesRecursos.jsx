import React, { useState } from 'react';
import { Modal, Button, Table, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { BsSearch, BsPlusLg, BsDownload, BsEye } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const recursosPorCategoria = {
  "Papelería": ["Lápiz", "Borrador", "Pluma"],
  "Limpieza": ["Cloro", "Jabón", "Escoba"]
};

const stockDisponible = {
  "Lápiz": 50,
  "Borrador": 30,
  "Pluma": 20,
  "Cloro": 10,
  "Jabón": 25,
  "Escoba": 15
};

const Solicitudes = () => {
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [recurso, setRecurso] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [solicitudTemp, setSolicitudTemp] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);

  const handleAgregar = () => {
    if (!categoria || !recurso || cantidad < 1) return;
    setSolicitudTemp([...solicitudTemp, { categoria, recurso, cantidad }]);
    setRecurso('');
    setCantidad(1);
  };

  const handleGuardarSolicitud = () => {
    const nueva = {
      descripcion: `Solicitud de ${solicitudTemp.length} recurso(s)`,
      fecha: new Date().toISOString().substring(0, 10),
      estatus: 'Cancelado',
      recursos: solicitudTemp
    };
    setSolicitudes([...solicitudes, nueva]);
    setSolicitudTemp([]);
    setShowModal(false);
  };

  const exportarPDF = (solicitud) => {
    const doc = new jsPDF();
    doc.text("Solicitud de Recursos", 14, 10);
    doc.text(`Descripción: ${solicitud.descripcion}`, 14, 20);
    doc.text(`Fecha: ${solicitud.fecha}`, 14, 30);
    doc.autoTable({
      startY: 40,
      head: [["Categoría", "Recurso", "Cantidad"]],
      body: solicitud.recursos.map(r => [r.categoria, r.recurso, r.cantidad])
    });
    doc.save("solicitud.pdf");
  };

  return (
    <div className="container py-4">
      <h4>Solicitudes</h4>
      <Row className="g-3 mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control placeholder="Buscar" value={search} onChange={e => setSearch(e.target.value)} />
            <InputGroup.Text><BsSearch /></InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={3}><Form.Control type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} /></Col>
        <Col md={3}><Form.Control type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} /></Col>
        <Col md={2} className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}><BsPlusLg /> Agregar Solicitud</Button>
        </Col>
      </Row>

      <Table bordered hover className="text-center">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((sol, idx) => (
            <tr key={idx}>
              <td>{sol.descripcion}</td>
              <td>{sol.fecha}</td>
              <td>{sol.estatus}</td>
              <td>
                <Button size="sm" variant="outline-danger" onClick={() => exportarPDF(sol)}><BsDownload /></Button>{' '}
                <Button size="sm" variant="outline-info" href="/ver-solicitud.html" target="_blank"><BsEye /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Nueva Solicitud</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Categoría</Form.Label>
            <Form.Select value={categoria} onChange={e => { setCategoria(e.target.value); setRecurso(''); }}>
              <option value="">Seleccione</option>
              {Object.keys(recursosPorCategoria).map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Recurso</Form.Label>
            <Form.Select value={recurso} onChange={e => setRecurso(e.target.value)} disabled={!categoria}>
              <option value="">Seleccione</option>
              {(recursosPorCategoria[categoria] || []).map((rec, i) => <option key={i} value={rec}>{rec}</option>)}
            </Form.Select>
            {recurso && <div className="text-muted">Disponibles: {stockDisponible[recurso] || 0}</div>}
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control type="number" value={cantidad} min={1} onChange={e => setCantidad(Number(e.target.value))} />
          </Form.Group>

          <Button onClick={handleAgregar}>Agregar a solicitud</Button>

          {solicitudTemp.length > 0 && (
            <Table size="sm" bordered className="mt-3">
              <thead><tr><th>Categoría</th><th>Recurso</th><th>Cantidad</th></tr></thead>
              <tbody>
                {solicitudTemp.map((r, i) => <tr key={i}><td>{r.categoria}</td><td>{r.recurso}</td><td>{r.cantidad}</td></tr>)}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardarSolicitud} disabled={solicitudTemp.length === 0}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Solicitudes;
