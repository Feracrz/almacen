import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { BsSearch, BsFilePdf, BsFileEarmarkText, BsClockHistory } from 'react-icons/bs';
import ModalAsignacion from './modalAsignacion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const recursosPorCategoria = {
  "Papelería": [
    "Acuarela escolar", "Bicolor", "Block para acuarela", "Borradores de pizarrón blanco",
    "Carpeta blanca carta tres orificios arillo en 3 pulgadas", "Carpeta blanca carta tres orificios arillo en 4 pulgadas",
    "Carpeta blanca carta tres orificios arillo en 5 pulgadas", "Carpeta 2 orificios tamaño carta", "Carpeta 2 orificios tamaño oficio",
    "Charola organizador", "Chinchetas", "Cinta adhesiva transparente delgada", "Cinta canela",
    "Clip mariposa", "Clip No. 2", "Correcto lápiz", "Corrector en cinta", "Cuaderno profesional",
    "Cúter", "Dedal", "Diurex", "Diurex 1 pulgada", "Engrapadora", "Etiquetas no.24", "Etiquetas no.25",
    "Ficha bibliográfica", "Ficha de trabajo", "Folder tamaño carta", "Folder tamaño oficio", "Gaveta del no 14",
    "Gaveta paleta", "Goma", "Grapas", "Lapicero tinta azul", "Lapicero tinta azul de gel", "Lapicero tinta negra",
    "Lapicero tinta rojo", "Lápiz", "Lápiz adhesivo", "Lápiz carmín rojo", "Libreta forma francesa pasta dura",
    "Ligas #18", "Marcador permanente negro", "Marcador permanente rojo", "Marca texto", "Notas adhesivas chico",
    "Notas adhesivas grande", "Notas adhesivas medianas", "Papel bond tamaño carta", "Papel bond tamaño carta colores intensos",
    "Papel bond tamaño oficio", "Papel opalina blanca t/oficio", "Papel opalina tamaña carta 125 gr",
    "Papel opalina tamaña carta 225 gr", "Perforadora de 1 orificio", "Perforadora de 2 orificios",
    "Perforadora de 3 orificios", "Plumón de pizarrón", "Post-it-banderitas", "Protector de hoja carta",
    "Quita grapas", "Regla metálica 30cm", "Sacapuntas", "Sello de acuse", "Separadores de hojas 10 divisiones",
    "Separadores de hojas 15 divisiones", "Sobre carta", "Sobre de papel (CD/DVD)", "Sobre oficio",
    "Sujeta documentos chico 25mm", "Sujeta documentos grande 51mm", "Sujeta documentos mediano 32mm",
    "Tijera"
  ],
  "Material de limpieza": [
    "Aromatizante en aerosol", "Bolsa negra grande", "Bolsa negra mediana", "Bolsa para cesto 61x61",
    "Cepillo de acero inoxidable", "Cloro", "Cloro para mascotas", "Desinfectante en aerosol mediano",
    "Detergente liquido", "Escoba", "Fabulo", "Fibra", "Gel antibacterial", "Guantes de látex",
    "Insecticida", "Jabón de cartucho", "Jabón en polvo", "Jabón para manos", "Jerga gruesa", "Lija de agua",
    "Limpiador para piso laminados", "Líquido para vidrios", "Lustrador de muebles en aerosol", "Mechudo",
    "Microfibras", "Mop Americano", "Pastilla desodorante", "Pino", "Sanitas"
  ],
  "Insumos de oficina": [
    "Agua embotellada",
    "Azúcar refinada",
    "Bebida rehidratante suero",
    "Café soluble",
    "Charolas desechables",
    "Cuchara cafetería",
    "Cuchara grande",
    "Galletas finas",
    "Galletas surtido rico",
    "Kleenex",
    "Papel higiénico",
    "Papel higiénico jumbo",
    "Pila 9V",
    "Pila AA",
    "Pila AAA",
    "Pila botón modelo CR2032",
    "Refresco de lata coca cola",
    "Refresco de lata sabores",
    "Servilletas",
    "Te",
    "Tenedor biodegradable desechable",
    "Toalla desinfectantes",
    "Vasos térmicos"
  ],

  "Consumibles": [
  "DVD-R", "Memoria USB 16gb", "Memoria USB 32gb", "Memoria USB 64gb", "Memoria USB 128gb",
  "Ribbon idp", "Ribon holograma", "Tambor de imagen DR820", "Tambor de imagen HP 219ª",
  "Tinta color negra", "Tinta HP 954 BK", "Tinta HP 954 C", "Tinta HP 954 M", "Tinta HP 954 Y",
  "Tinta HP GT52 Black", "Tinta HP GT52 Cian", "Tinta HP GT52 Magenta", "Tinta HP GT52 Yellow",
  "Tóner 410A negro", "Tóner 5272 negro", "Tóner CE 285A", "Tóner CE 310A", "Tóner CE 311A",
  "Tóner CE 312A amarillo", "Tóner CE 313A magenta", "Tóner HP CF280A", "Tóner HP 136A", 
  "Tóner HP 410", "Tóner HP 411", "Tóner HP 412", "Tóner HP 413", "Tóner HP 414C", "Tóner HP 414B", 
  "Tóner HP 414M", "Tóner HP 414Y", "Tóner HP CF278A", "Tóner TK 1122", "Tóner TK 1147", 
  "Tóner TK 1152", "Tóner TK 3102", "Tóner TK 3182", "Tóner TK 5272C", "Tóner TK 5272K", 
  "Tóner TK 5272M", "Tóner TK 5272Y", "Tóner TK 6307", "Tóner TN 1060", "Tóner TN 850", 
  "Tóner TN890", "Tóner W1360A", "Tóner W2020A", "Tóner W2021A", "Tóner W2023A"
]
};

const SolicitudesAsignacion = () => {
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [showAsignacionModal, setShowAsignacionModal] = useState(false);
  const [showCancelarModal, setShowCancelarModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [solicitudes, setSolicitudes] = useState([
    { id: 1, area: 'Recursos Humanos', solicitante: 'Perla López', fecha: '2025-07-20', estatus: 'Pendiente', recursos: [{ nombre: 'Papel bond tamaño oficio', stock: 50, cantidadSolicitada: 10 }] },
    { id: 2, area: 'TI', solicitante: 'Juan Pérez', fecha: '2025-07-22', estatus: 'Pendiente', recursos: [{ nombre: 'Memoria USB 16gb', stock: 20, cantidadSolicitada: 5 }] },
    { id: 3, area: 'Presidencia', solicitante: 'Juan Pérez', fecha: '2025-07-22', estatus: 'Pendiente', recursos: [{ nombre: 'Tóner CE 312A amarillo', stock: 20, cantidadSolicitada: 8 }] }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Para modal estatus
  const [newStatus, setNewStatus] = useState("Pendiente");

  // Estado motivo cancelación obligatorio
  const [cancelReason, setCancelReason] = useState('');

  // Filtrar solicitudes
  const filteredSolicitudes = solicitudes.filter(s =>
    (s.area.toLowerCase().includes(search.toLowerCase()) || s.solicitante.toLowerCase().includes(search.toLowerCase())) &&
    (!fechaInicio || s.fecha >= fechaInicio) &&
    (!fechaFin || s.fecha <= fechaFin)
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolicitudes = filteredSolicitudes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

  // Abrir modal asignación
  const handleOpenAsignacion = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowAsignacionModal(true);
  };

  // Abrir modal cancelar
  const handleOpenCancelar = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowCancelarModal(true);
  };

  // Abrir modal estatus
  const handleOpenStatusModal = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setNewStatus(solicitud.estatus === "Pendiente" || solicitud.estatus === "En espera" ? solicitud.estatus : "Pendiente");
    setShowStatusModal(true);
  };

  // Confirmar cancelación
  const handleConfirmarCancelar = () => {
    if (!cancelReason.trim()) {
      alert("Debe proporcionar un motivo de cancelación.");
      return;
    }
    setSolicitudes(prev => prev.map(s => s.id === selectedSolicitud.id ? { ...s, estatus: "Cancelada" } : s));
    setHistorial(prev => [...prev, {
      id: selectedSolicitud.id,
      solicitante: selectedSolicitud.solicitante,
      area: selectedSolicitud.area,
      fecha: new Date().toISOString().slice(0, 10),
      accion: `Cancelación - Motivo: ${cancelReason}`
    }]);
    setCancelReason('');
    setShowCancelarModal(false);
  };

  // Cambiar estatus
  const handleChangeStatus = () => {
    setSolicitudes(prev => prev.map(s => s.id === selectedSolicitud.id ? { ...s, estatus: newStatus } : s));
    setHistorial(prev => [...prev, {
      id: selectedSolicitud.id,
      solicitante: selectedSolicitud.solicitante,
      area: selectedSolicitud.area,
      fecha: new Date().toISOString().slice(0, 10),
      accion: `Cambio de estatus a ${newStatus}`
    }]);
    setShowStatusModal(false);
  };

  // Nueva función: Descargar PDF a partir del HTML externo, cargado en iframe oculto
  const handleDownloadPDF = (solicitud) => {
    const encoded = encodeURIComponent(JSON.stringify(solicitud));
    const url = `/detalle-solictud.html?data=${encoded}`;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const content = iframe.contentWindow.document.body;

      await doc.html(content, {
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 800,
        callback: function (doc) {
          const fechaStr = solicitud.fecha.replace(/-/g, '');
          doc.save(`Solicitud_${fechaStr}.pdf`);
          document.body.removeChild(iframe);
        }
      });
    };
  };

  // Ver HTML
  const handleViewHTML = () => {
    window.open('/detalle-solictud.html', '_blank'); // archivo en /public
  };

  return (
    <div className="container py-4">
      <h4>Gestión de Solicitudes</h4>
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
      <Table bordered hover>
        <thead className="text-center">
          <tr>
            <th># Solicitud</th>
            <th>Área</th>
            <th>Solicitante</th>
            <th>Fecha</th>
            <th>Estatus</th>
            <th>Atendio</th>
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
              <td>Rosa Maria Tolentino</td>
              <td>{s.estatus}</td>
              <td>
                {(s.estatus === "Pendiente" || s.estatus === "En espera") ? (
                  <>
                    <Button size="sm" variant="outline-info" onClick={() => handleOpenAsignacion(s)}>Asignarr</Button>{' '}
                    <Button size="sm" variant="outline-warning" onClick={() => handleOpenStatusModal(s)}>Estatus</Button>{' '}
                    <Button size="sm" variant="outline-danger" onClick={() => handleOpenCancelar(s)}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline-primary" onClick={() => handleDownloadPDF(s)} title="Descargar PDF"><BsFilePdf /></Button>{' '}
                    <Button size="sm" variant="outline-secondary" onClick={handleViewHTML} title="Ver documento"><BsFileEarmarkText /></Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className='d-flex justify-content-center'>
        <p>Mostrando <strong>{filteredSolicitudes.length === 0 ? 0 : indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, filteredSolicitudes.length)}</strong> de <strong>{filteredSolicitudes.length}</strong> registros</p>
      </div>
      <Pagination className='d-flex justify-content-center'>
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item key={idx} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
      <Row className="mt-3">
        <Col><Button variant="outline-secondary" onClick={() => setShowHistorialModal(true)}><BsClockHistory /> Ver Historial</Button></Col>
        <Col md={2}>
          <Form.Select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Modal Asignación */}
      {selectedSolicitud && (
        <ModalAsignacion
          show={showAsignacionModal}
          onHide={() => setShowAsignacionModal(false)}
          solicitud={selectedSolicitud}
          recursosPorCategoria={recursosPorCategoria}
          setSolicitudes={setSolicitudes}
          setHistorial={setHistorial}
        />
      )}

      {/* Modal Cancelar */}
      <Modal show={showCancelarModal} onHide={() => setShowCancelarModal(false)}>
        <Modal.Header closeButton><Modal.Title>Confirmar Cancelación</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Motivo de cancelación (obligatorio):</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Escriba el motivo de la cancelación"
            />
          </Form.Group>
          <p className="mt-3">¿Seguro que quieres cancelar la solicitud #{selectedSolicitud?.id}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelarModal(false)}>Canelar</Button>
          <Button variant="danger" onClick={handleConfirmarCancelar}>Aceptar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Estatus */}
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

      {/* Modal Historial */}
      <Modal show={showHistorialModal} onHide={() => setShowHistorialModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Historial de Acciones</Modal.Title></Modal.Header>
        <Modal.Body>
          {historial.length === 0 ? <p>No hay registros.</p> :
            <Table bordered>
              <thead><tr><th>ID</th><th>Solicitante</th><th>Área</th><th>Fecha</th><th>Movienmto</th></tr></thead>
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