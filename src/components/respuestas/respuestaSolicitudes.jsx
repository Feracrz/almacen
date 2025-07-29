import React, { useState } from 'react';
import { Table, Button, Form, Modal, Row, Col, InputGroup, Pagination } from 'react-bootstrap';
import { BsSearch, BsEye, BsSlashCircle, BsClockHistory } from 'react-icons/bs';

const recursosPorCategoria = {
  "Papelería": ["Acuarela escolar", "Bicolor"],
  "Material de limpieza": ["Cloro", "Escoba"],
  "Insumos de oficina": ["Agua embotellada", "Café soluble"],
  "Consumibles": ["Memoria USB 16gb", "Tóner HP 410"]
};

const SolicitudesAsignacion = () => {
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [showPopout, setShowPopout] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmGuardar, setShowConfirmGuardar] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);

  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [cantidadesAsignar, setCantidadesAsignar] = useState({});
  const [nuevosRecursos, setNuevosRecursos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cancelReason, setCancelReason] = useState('');
  const [newStatus, setNewStatus] = useState('Pendiente');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [solicitudes, setSolicitudes] = useState([
    { 
      id: 1, area: 'Recursos Humanos', solicitante: 'Ana López', fecha: '2025-07-20', estatus: 'Pendiente',
      recursos: [{ nombre: 'Acuarela escolar', stock: 50, cantidadSolicitada: 10 }]
    },
    { 
      id: 2, area: 'TI', solicitante: 'Juan Pérez', fecha: '2025-07-22', estatus: 'Pendiente',
      recursos: [{ nombre: 'Memoria USB 16gb', stock: 20, cantidadSolicitada: 5 }]
    }
  ]);

  const categorias = Object.keys(recursosPorCategoria);

  // ----- Agregar recursos dinámicos -----
  const handleAgregarRecurso = () => {
    setNuevosRecursos([...nuevosRecursos, { categoria: "", recurso: "", stock: 0, cantidad: 0 }]);
  };
  const handleEliminarRecurso = (index) => setNuevosRecursos(nuevosRecursos.filter((_, i) => i !== index));
const handleChangeRecurso = (index, field, value) => {
  const updated = [...nuevosRecursos];
  if (field === "cantidad") {
    const cantidad = Number(value);
    if (cantidad < 0) return; // no permitir negativos
    if (cantidad > updated[index].stock) return; // no permitir más que el stock disponible
    updated[index].cantidad = cantidad;
  } else {
    updated[index][field] = value;
    if (field === "categoria") {
      updated[index].recurso = "";
      updated[index].stock = 0; // reiniciar stock si cambia categoría
    }
    if (field === "recurso") {
      // Asignamos un stock inicial según el recurso (ejemplo: siempre 10 por ahora)
      updated[index].stock = 10;
    }
  }
  setNuevosRecursos(updated);
};

  // ----- Abrir modales -----
  const handleOpenPopout = (solicitud) => {
    setSelectedSolicitud(solicitud);
    const inicial = {};
    solicitud.recursos.forEach((r, idx) => inicial[idx] = 0);
    setCantidadesAsignar(inicial);
    setNuevosRecursos([]);
    setShowPopout(true);
  };
  const handleOpenStatusModal = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setNewStatus(solicitud.estatus);
    setShowStatusModal(true);
  };
// ----- Validar Nuevos Recursos -----
const validarNuevosRecursos = () => {
  for (let r of nuevosRecursos) {
    if (!r.categoria.trim() || !r.recurso.trim() || r.cantidad <= 0) {
      alert("Todos los recursos nuevos deben tener categoría, recurso y cantidad válida.");
      return false;
    }
  }
  return true;
};
  // ----- Guardar asignación -----
  const handleConfirmGuardar = () => setShowConfirmGuardar(true);

  
  const handleGuardarAsignacion = () => {
    if (!validarNuevosRecursos()) return;
    const fechaAccion = new Date().toISOString().slice(0, 10);
    setSolicitudes(prev =>
      prev.map(s => {
        if (s.id === selectedSolicitud.id) {
          const nuevosRecursosAsignados = nuevosRecursos.map(r => ({
            nombre: r.recurso,
            stock: r.stock - r.cantidad,
            cantidadSolicitada: r.cantidad
          }));
          const recursosActualizados = [...s.recursos, ...nuevosRecursosAsignados];
          const estatus = Object.values(cantidadesAsignar).some(c => c > 0) || nuevosRecursos.length > 0 ? "Asignada" : s.estatus;
          return { ...s, recursos: recursosActualizados, estatus };
        }
        return s;
      })
      
    );
    
    
    setHistorial(prev => [...prev, {
      id: selectedSolicitud.id,
      solicitante: selectedSolicitud.solicitante,
      area: selectedSolicitud.area,
      fecha: fechaAccion,
      accion: "Asignación de recursos"
    }]);
    setNuevosRecursos([]);
    setShowPopout(false);
    setShowConfirmGuardar(false);
  };

  // ----- Cancelar solicitud -----
  const handleCancelarSolicitud = () => {
    if (!cancelReason.trim()) {
      alert("Debe proporcionar un motivo de cancelación.");
      return;
    }
    setSolicitudes(prev => prev.map(s => s.id === selectedSolicitud.id ? { ...s, estatus: 'Cancelada' } : s));
    setHistorial(prev => [...prev, {
      id: selectedSolicitud.id,
      solicitante: selectedSolicitud.solicitante,
      area: selectedSolicitud.area,
      fecha: new Date().toISOString().slice(0, 10),
      accion: `Cancelación: ${cancelReason}`
    }]);
    setCancelReason('');
    setShowCancelModal(false);
  };

  // ----- Cambiar estatus -----
  const handleChangeStatus = () => {
    setSolicitudes(prev => prev.map(s => s.id === selectedSolicitud.id ? { ...s, estatus: newStatus } : s));
    setHistorial(prev => [...prev, {
      id: selectedSolicitud.id,
      solicitante: selectedSolicitud.solicitante,
      area: selectedSolicitud.area,
      fecha: new Date().toISOString().slice(0, 10),
      accion: `Cambio de estatus a: ${newStatus}`
    }]);
    setShowStatusModal(false);
  };

  // ----- Filtros -----
  const filteredSolicitudes = solicitudes.filter(s =>
    (s.area.toLowerCase().includes(search.toLowerCase()) || s.solicitante.toLowerCase().includes(search.toLowerCase())) &&
    (!fechaInicio || s.fecha >= fechaInicio) &&
    (!fechaFin || s.fecha <= fechaFin)
  );

  // ----- Paginación -----
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolicitudes = filteredSolicitudes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

  return (
    <div className="container py-4">
      <h4>Gestión de Solicitudes</h4>

      {/* Filtros */}
      <Row className="g-3 mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
            <InputGroup.Text><BsSearch /></InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={3}><Form.Control type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} /></Col>
        <Col md={3}><Form.Control type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} /></Col>
      </Row>

      {/* Selector cantidad por página */}
      

      {/* Tabla */}
      <Table bordered hover>
        <thead className="text-center">
          <tr>
            <th># Solicitud</th>
            <th>Área</th>
            <th>Solicitante</th>
            <th>Fecha Solicitud</th>
            <th>Estatus</th>
            <th>Autorizó</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentSolicitudes.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.area}</td>
              <td>{s.solicitante}</td>
              <td>{s.fecha}</td>
              <td>{s.estatus}</td>
              <td>Ana Sofia Cano</td>
              <td>
                <Button size="sm" variant="outline-info" disabled={s.estatus === 'Cancelada'} onClick={() => handleOpenPopout(s)}>Ver/Asignar</Button>{' '}
                <Button size="sm" variant="outline-warning" disabled={s.estatus === 'Cancelada'} onClick={() => handleOpenStatusModal(s)}>Estatus</Button>{' '}
                <Button size="sm" variant="outline-danger" disabled={s.estatus === 'Cancelada'} onClick={() => { setSelectedSolicitud(s); setShowCancelModal(true); }}>Cancelar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Info paginación */}
      <div className='d-flex justify-content-center'><p>Mostrando <strong>{filteredSolicitudes.length === 0 ? 0 : indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, filteredSolicitudes.length)}</strong> de <strong>{filteredSolicitudes.length}</strong> registros</p></div>

      <Pagination className='d-flex justify-content-center'>
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item key={idx} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
      
        <Row className="text-end">
        
        <Col >
          <Button variant="outline-secondary" onClick={() => setShowHistorialModal(true)}><BsClockHistory /> Ver Historial</Button>
        </Col>
        <Col  md={2}>
          <Form.Select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={5}>20 por página</option>
            <option value={10}>50 por página</option>
            <option value={20}>100 por página</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Modal Ver/Asignar */}
      <Modal show={showPopout} onHide={() => setShowPopout(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Detalle de Solicitud</Modal.Title></Modal.Header>
        {selectedSolicitud && (
          <Modal.Body>
            <p><strong>Área:</strong> {selectedSolicitud.area}</p>
            <p><strong>Solicitante:</strong> {selectedSolicitud.solicitante}</p>
            <p><strong>Fecha de Solicitud:</strong> {selectedSolicitud.fecha}</p>
            <h5>Recursos Solicitados</h5>
            <Table bordered>
              <thead><tr><th>Recurso</th><th>Solicitado</th><th>Stock</th><th>Cantidad a Asignar</th></tr></thead>
              <tbody>
                {selectedSolicitud.recursos.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.nombre}</td>
                    <td>{r.cantidadSolicitada}</td>
                    <td>{r.stock}</td>
                    <td><Form.Control type="number" min={0} max={r.stock} value={cantidadesAsignar[idx] || 0} onChange={e => setCantidadesAsignar({ ...cantidadesAsignar, [idx]: Number(e.target.value) })} /></td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
            <h5>Agregar Nuevos Recursos</h5>
            <Button variant="outline-success" size="sm" onClick={handleAgregarRecurso}>+ Agregar</Button>
            {nuevosRecursos.length > 0 && (
              <Table bordered className="mt-3">
                <thead><tr><th>Categoría</th><th>Recurso</th><th>Stock</th><th>Cantidad</th><th>Acciones</th></tr></thead>
                <tbody>
                  {nuevosRecursos.map((r, idx) => (
                    <tr key={idx}>
                      <td>
                        <Form.Select value={r.categoria} onChange={(e) => handleChangeRecurso(idx, "categoria", e.target.value)}><option value="">Seleccione</option>{categorias.map((c, i) => <option key={i} value={c}>{c}</option>)}</Form.Select>
                      </td>
                      <td>
                        <Form.Select value={r.recurso} disabled={!r.categoria} onChange={(e) => handleChangeRecurso(idx, "recurso", e.target.value)}><option value="">Seleccione</option>{r.categoria && recursosPorCategoria[r.categoria].map((re, i) => <option key={i} value={re}>{re}</option>)}</Form.Select>
                      </td>
                      <td>{r.stock - r.cantidad}</td>
                      <td><Form.Control type="number" min={1} value={r.cantidad} onChange={(e) => handleChangeRecurso(idx, "cantidad", e.target.value)} /></td>
                      <td><Button variant="outline-danger" size="sm" onClick={() => handleEliminarRecurso(idx)}>Eliminar</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopout(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleConfirmGuardar}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmar Guardado */}
      <Modal show={showConfirmGuardar} onHide={() => setShowConfirmGuardar(false)}>
        <Modal.Header closeButton><Modal.Title>Confirmar Asignación</Modal.Title></Modal.Header>
        <Modal.Body>¿Está seguro de guardar esta asignación?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmGuardar(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardarAsignacion}>Aceptar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Cambiar Estatus */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton><Modal.Title>Cambiar Estatus</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nuevo estatus:</Form.Label>
            <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
  <option value="Pendiente">Pendiente</option>
  <option value="En espera">En espera</option>
</Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleChangeStatus}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Cancelar Solicitud */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton><Modal.Title>Cancelar Solicitud</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Motivo de cancelación:</Form.Label>
            <Form.Control as="textarea" rows={3} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Cerrar</Button>
          <Button variant="danger" onClick={handleCancelarSolicitud}>Aceptar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Historial */}
      <Modal show={showHistorialModal} onHide={() => setShowHistorialModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Historial de Acciones</Modal.Title></Modal.Header>
        <Modal.Body>
          {historial.length === 0 ? <p>No hay acciones registradas.</p> :
            <Table bordered>
              <thead><tr><th>ID</th><th>Solicitante</th><th>Área</th><th>Fecha</th><th>Acción</th></tr></thead>
              <tbody>
                {historial.map((h, idx) => (
                  <tr key={idx}><td>{h.id}</td><td>{h.solicitante}</td><td>{h.area}</td><td>{h.fecha}</td><td>{h.accion}</td></tr>
                ))}
              </tbody>
            </Table>
          }
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowHistorialModal(false)}>Cerrar</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default SolicitudesAsignacion;