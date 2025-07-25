import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Row, Col, Table } from 'react-bootstrap';
import { BsSearch, BsPlusLg, BsTrash } from 'react-icons/bs';
import TablaSolicitudes from './tablaSolicitudes';

const recursosPorCategoria = {
  "Papelería": ["Acuarela escolar", "Bicolor", "Block para acuarela"],
  "Material de limpieza": ["Aromatizante en aerosol", "Bolsa negra grande", "Cloro"],
  "Insumos de oficina": ["Agua embotellada", "Café soluble", "Galletas finas"],
  "Consumibles": ["DVD-R", "Memoria USB 16gb", "Tóner HP 410"]
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

  // Agregar recurso temporal
  const handleAgregar = () => {
    if (!categoria || !recurso || cantidad < 1) return;
    setSolicitudTemp([...solicitudTemp, { categoria, recurso, cantidad }]);
    setRecurso('');
    setCantidad(1);
  };

  // Editar un campo en la tabla temporal
  const handleEdit = (index, field, value) => {
    const updated = [...solicitudTemp];
    updated[index][field] = value;
    // Si cambia la categoría, resetear el recurso
    if (field === 'categoria') {
      updated[index].recurso = '';
    }
    setSolicitudTemp(updated);
  };

  // Eliminar un recurso temporal
  const handleDelete = (index) => {
    setSolicitudTemp(solicitudTemp.filter((_, i) => i !== index));
  };

  // Guardar solicitud completa
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

  return (
    <div className="container py-4">
      <h4>Solicitudes/Historial</h4>
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
      <TablaSolicitudes solicitudes={solicitudes} />

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Categoría</Form.Label>
                <Form.Select value={categoria} onChange={e => { setCategoria(e.target.value); setRecurso(''); }}>
                  <option value="">Seleccione</option>
                  {Object.keys(recursosPorCategoria).map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Recurso</Form.Label>
                <Form.Select value={recurso} onChange={e => setRecurso(e.target.value)} disabled={!categoria}>
                  <option value="">Seleccione</option>
                  {(recursosPorCategoria[categoria] || []).map((rec, i) => <option key={i} value={rec}>{rec}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Cantidad</Form.Label>
                <Form.Control type="number" value={cantidad} min={1} onChange={e => setCantidad(Number(e.target.value))} />
              </Form.Group>
            </Col>
          </Row>

          <Button onClick={handleAgregar} className="mb-3">Agregar a solicitud</Button>

          {solicitudTemp.length > 0 && (
            <Table size="sm" bordered>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Recurso</th>
                  <th>Cantidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudTemp.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <Form.Select value={r.categoria} onChange={(e) => handleEdit(i, 'categoria', e.target.value)}>
                        <option value="">Seleccione</option>
                        {Object.keys(recursosPorCategoria).map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Select value={r.recurso} onChange={(e) => handleEdit(i, 'recurso', e.target.value)} disabled={!r.categoria}>
                        <option value="">Seleccione</option>
                        {(recursosPorCategoria[r.categoria] || []).map((rec, idx) => <option key={idx} value={rec}>{rec}</option>)}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control type="number" value={r.cantidad} min={1} onChange={(e) => handleEdit(i, 'cantidad', Number(e.target.value))} />
                    </td>
                    <td className="text-center">
                      <Button variant="danger" size="sm" onClick={() => handleDelete(i)}>
                        <BsTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
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