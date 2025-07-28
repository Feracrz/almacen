import React, { useState } from 'react';
import { Table, Button, Form, Modal, Row, Col, InputGroup, Pagination } from 'react-bootstrap';
import { BsSearch, BsEye, BsSlashCircle } from 'react-icons/bs';

const SolicitudesAsignacion = () => {
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [showPopout, setShowPopout] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmGuardar, setShowConfirmGuardar] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [cantidadesAsignar, setCantidadesAsignar] = useState({});
  const [historial, setHistorial] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

 const [solicitudes, setSolicitudes] = useState([
    { 
      id: 1, 
      area: 'Recursos Humanos', 
      solicitante: 'Ana López', 
      fecha: '2025-07-20', 
      estatus: 'Pendiente',
      recursos: [
        { nombre: 'Cuadernos', stock: 50, cantidadSolicitada: 10 },
        { nombre: 'Plumas', stock: 100, cantidadSolicitada: 20 }
      ]
    },
    { 
      id: 2, 
      area: 'TI', 
      solicitante: 'Juan Pérez', 
      fecha: '2025-07-22', 
      estatus: 'Pendiente',
      recursos: [
        { nombre: 'Memorias USB', stock: 20, cantidadSolicitada: 5 }
      ]
    },
    { 
      id: 3, 
      area: 'Devs', 
      solicitante: 'Juan Pérez', 
      fecha: '2025-07-22', 
      estatus: 'Pendiente',
      recursos: [
        { nombre: 'Lapiceros', stock: 2, cantidadSolicitada: 5 }
      ]
    },
  ]);

  // --- Catálogo de categorías y recursos
  const recursosPorCategoria = {
    "Papelería": [ "Acuarela escolar", "Bicolor", "Block para acuarela", "Borradores de pizarrón blanco", "Carpeta blanca carta tres orificios arillo en 3 pulgadas" ],
    "Material de limpieza": [ "Aromatizante en aerosol", "Bolsa negra grande", "Bolsa negra mediana", "Cepillo de acero inoxidable", "Cloro" ],
    "Insumos de oficina": [ "Agua embotellada", "Azúcar refinada", "Bebida rehidratante suero", "Café soluble", "Charolas desechables" ],
    "Consumibles": [ "DVD-R", "Memoria USB 16gb", "Memoria USB 32gb", "Memoria USB 64gb", "Tóner 410A negro" ]
  };
  const categorias = Object.keys(recursosPorCategoria);

  // --- NUEVA SECCIÓN: Recursos dinámicos
  const [nuevosRecursos, setNuevosRecursos] = useState([]);

  const handleAgregarRecurso = () => {
    setNuevosRecursos([
      ...nuevosRecursos,
      { categoria: "", recurso: "", stock: 0, cantidad: 0 }
    ]);
  };

  const handleEliminarRecurso = (index) => {
    setNuevosRecursos(nuevosRecursos.filter((_, i) => i !== index));
  };

  const handleChangeRecurso = (index, field, value) => {
    const updated = [...nuevosRecursos];
    updated[index][field] = field === "cantidad" || field === "stock" ? Number(value) : value;
    // Reset recurso si cambia categoría
    if (field === "categoria") updated[index].recurso = "";
    setNuevosRecursos(updated);
  };

  const validarNuevosRecursos = () => {
    for (let r of nuevosRecursos) {
      if (!r.categoria.trim() || !r.recurso.trim() || r.cantidad <= 0) {
        alert("Todos los recursos nuevos deben tener categoría, recurso y cantidad válida.");
        return false;
      }
    }
    return true;
  };

  // --- Abrir modal
  const handleOpenPopout = (solicitud) => {
    setSelectedSolicitud(solicitud);
    const inicial = {};
    solicitud.recursos.forEach((r, idx) => inicial[idx] = 0);
    setCantidadesAsignar(inicial);
    setNuevosRecursos([]);
    setShowPopout(true);
  };

  // --- Confirmar guardado
  const handleConfirmGuardar = () => {
    setShowConfirmGuardar(true);
  };

  // --- Guardar
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
          const estatus = Object.values(cantidadesAsignar).some(c => c > 0) || nuevosRecursos.length > 0 ? "Asignada" : "No asignada";
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
      cantidades: { ...cantidadesAsignar, nuevosRecursos }
    }]);

    setNuevosRecursos([]);
    setShowPopout(false);
    setShowConfirmGuardar(false);
  };

  // No asignar
  const handleNoAsignar = () => {
    const vacio = {};
    selectedSolicitud.recursos.forEach((_, idx) => vacio[idx] = 0);
    setCantidadesAsignar(vacio);
  };

  // Cancelar
  const handleCancelarSolicitud = () => {
    setSolicitudes(prev =>
      prev.map(s => s.id === selectedSolicitud.id ? { ...s, estatus: 'Cancelada' } : s)
    );
    setShowCancelModal(false);
    setShowPopout(false);
  };

  // --- Filtros
  const filteredSolicitudes = solicitudes.filter(s =>
    (s.area.toLowerCase().includes(search.toLowerCase()) || 
     s.solicitante.toLowerCase().includes(search.toLowerCase())) &&
    (!fechaInicio || s.fecha >= fechaInicio) &&
    (!fechaFin || s.fecha <= fechaFin)
  );

  // --- Paginación
  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);
  const currentSolicitudes = filteredSolicitudes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        <Col md={3}>
          <Form.Control type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Control type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </Col>
      </Row>

      {/* Tabla de solicitudes */}
      <Table bordered hover>
        <thead className="text-center">
          <tr>
            <th># Solicitud</th>
            <th>Área</th>
            <th>Solicitante</th>
            <th>Fecha Solicitud</th>
            <th>Fecha Atención</th>
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
              <td>{s.fecha}</td>              
              <td>{s.estatus}</td>
              <td>Ana Sofia P</td>
              <td>
                <Button 
                  size="sm" 
                  variant="outline-info" 
                  disabled={s.estatus === 'Cancelada'} 
                  onClick={() => handleOpenPopout(s)}>
                  <BsEye /> Ver/Asignar
                </Button>{' '}
                <Button 
                  size="sm" 
                  variant="outline-danger" 
                  disabled={s.estatus === 'Cancelada'} 
                  onClick={() => { setSelectedSolicitud(s); setShowCancelModal(true); }}>
                  <BsSlashCircle /> Cancelar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginación */}
      <Pagination>
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item key={idx} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* MODAL DETALLE */}
      <Modal show={showPopout} onHide={() => setShowPopout(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Solicitud</Modal.Title>
        </Modal.Header>
        {selectedSolicitud && (
          <Modal.Body>
            <p><strong>Área:</strong> {selectedSolicitud.area}</p>
            <p><strong>Solicitante:</strong> {selectedSolicitud.solicitante}</p>
            <p><strong>Fecha de Solicitud:</strong> {selectedSolicitud.fecha}</p>

            <h5>Recursos Solicitados</h5>
            <Table bordered>
              <thead>
                <tr>
                  <th>Recurso</th>
                  <th>Solicitado</th>
                  <th>Stock Disponible</th>
                  <th>Cantidad a Asignar</th>
                </tr>
              </thead>
              <tbody>
                {selectedSolicitud.recursos.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.nombre}</td>
                    <td>{r.cantidadSolicitada}</td>
                    <td>{r.stock}</td>
                    <td>
                      <Form.Control 
                        type="number" 
                        min={0} 
                        max={r.stock} 
                        value={cantidadesAsignar[idx] || 0} 
                        onChange={e => setCantidadesAsignar({ ...cantidadesAsignar, [idx]: Number(e.target.value) })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <hr />
            <h5>Agregar Nuevos Recursos</h5>
            <Button variant="outline-success" size="sm" onClick={handleAgregarRecurso}>+ Agregar Recurso</Button>

            {nuevosRecursos.length > 0 && (
              <Table bordered className="mt-3">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Recurso</th>
                    <th>Stock Disponible</th>
                    <th>Cantidad a Asignar</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {nuevosRecursos.map((r, idx) => (
                    <tr key={idx}>
                      <td>
                        <Form.Select 
                          value={r.categoria} 
                          onChange={(e) => handleChangeRecurso(idx, "categoria", e.target.value)} 
                          required
                        >
                          <option value="">Seleccione</option>
                          {categorias.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select
                          value={r.recurso}
                          onChange={(e) => handleChangeRecurso(idx, "recurso", e.target.value)}
                          disabled={!r.categoria}
                          required
                        >
                          <option value="">Seleccione</option>
                          {r.categoria && recursosPorCategoria[r.categoria].map((re, i) => (
                            <option key={i} value={re}>{re}</option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        {r.stock}
                  
                      </td>
                      <td>
                        <Form.Control 
                          type="number" 
                          min={1} 
                          value={r.cantidad}
                          onChange={(e) => handleChangeRecurso(idx, "cantidad", e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <Button variant="outline-danger" size="sm" onClick={() => handleEliminarRecurso(idx)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <Button variant="secondary" onClick={handleNoAsignar}>No Asignar</Button>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopout(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmGuardar}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CONFIRMAR GUARDADO */}
      <Modal show={showConfirmGuardar} onHide={() => setShowConfirmGuardar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Asignación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de guardar esta asignación? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmGuardar(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardarAsignacion}>Aceptar</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CANCELAR SOLICITUD */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea cancelar esta solicitud? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleCancelarSolicitud}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SolicitudesAsignacion;