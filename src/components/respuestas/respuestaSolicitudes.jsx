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
          { nombre: 'lapiceros', stock: 2, cantidadSolicitada: 5 }
        ]
      },
  ]);

  // Abrir popout
  const handleOpenPopout = (solicitud) => {
    setSelectedSolicitud(solicitud);
    const inicial = {};
    solicitud.recursos.forEach((r, idx) => inicial[idx] = 0);
    setCantidadesAsignar(inicial);
    setShowPopout(true);
  };

  // Confirmar guardado
  const handleConfirmGuardar = () => {
    setShowConfirmGuardar(true);
  };

  // Guardar asignación
  const handleGuardarAsignacion = () => {
    const fechaAccion = new Date().toISOString().slice(0, 10);
    setSolicitudes(prev =>
      prev.map(s => {
        if (s.id === selectedSolicitud.id) {
          const nuevosRecursos = s.recursos.map((r, idx) => {
            const asignado = cantidadesAsignar[idx] || 0;
            return {
              ...r,
              stock: r.stock - asignado
            };
          });
          const estatus = Object.values(cantidadesAsignar).some(c => c > 0) ? "Asignada" : "No asignada";
          return { ...s, recursos: nuevosRecursos, estatus };
        }
        return s;
      })
    );

    // Guardar en historial
    setHistorial(prev => [...prev, {
      id: selectedSolicitud.id,
      solicitante: selectedSolicitud.solicitante,
      area: selectedSolicitud.area,
      fecha: fechaAccion,
      cantidades: { ...cantidadesAsignar }
    }]);

    setShowPopout(false);
    setShowConfirmGuardar(false);
  };

  // No asignar
  const handleNoAsignar = () => {
    const vacio = {};
    selectedSolicitud.recursos.forEach((_, idx) => vacio[idx] = 0);
    setCantidadesAsignar(vacio);
  };

  // Cancelar todo
  const handleCancelarSolicitud = () => {
    setSolicitudes(prev =>
      prev.map(s => s.id === selectedSolicitud.id ? { ...s, estatus: 'Cancelada' } : s)
    );
    setShowCancelModal(false);
    setShowPopout(false);
  };

  //filtrar
  const filteredSolicitudes = solicitudes.filter(s =>
    (s.area.toLowerCase().includes(search.toLowerCase()) || 
     s.solicitante.toLowerCase().includes(search.toLowerCase())) &&
    (!fechaInicio || s.fecha >= fechaInicio) &&
    (!fechaFin || s.fecha <= fechaFin)
  );

  //paginación
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

      <Table bordered hover>
        <thead className="text-center">
          <tr>
            <th># Solicitud</th>
            <th>Área</th>
            <th>Solicitante</th>
            <th>Fecha</th>
            <th>Estatus</th>
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

      {/* Paginación mejorarla por a que  ya  usaba antes  */}
      <Pagination>
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item key={idx} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Popout chido */}
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

            <Button variant="secondary" onClick={handleNoAsignar}>No Asignar</Button>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopout(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmGuardar}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* confirmandign */}
      <Modal show={showConfirmGuardar} onHide={() => setShowConfirmGuardar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Asignación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de guardar esta asignación? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmGuardar(false)}>No</Button>
          <Button variant="primary" onClick={handleGuardarAsignacion}>Sí, Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal cancelar solicitud para que se imprima bonito 
       */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea cancelar esta solicitud? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>No</Button>
          <Button variant="danger" onClick={handleCancelarSolicitud}>Sí, Cancelar</Button>
        </Modal.Footer>
      </Modal>

      {/* Historial */}
      <h5 className="mt-5">Historial de Asignaciones</h5>
      <Table bordered>
        <thead>
          <tr>
            <th># Solicitud</th>
            <th>Área</th>
            <th>Solicitante</th>
            <th>Fecha Asignación</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((h, idx) => (
            <tr key={idx}>
              <td>{h.id}</td>
              <td>{h.area}</td>
              <td>{h.solicitante}</td>
              <td>{h.fecha}</td>
              <td>
                {Object.entries(h.cantidades).map(([k, v]) => (
                  <div key={k}>Recurso {Number(k)+1}: {v}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SolicitudesAsignacion;