import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Row, Col, Table, Alert } from 'react-bootstrap';
import { BsSearch, BsPlusLg, BsTrash } from 'react-icons/bs';
import TablaSolicitudes from './tablaSolicitudes';

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
  const [error, setError] = useState(''); // <-- estado para error

  // Agregar recurso temporal con validación
  const handleAgregar = () => {
    if (!categoria || !recurso || cantidad < 1) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setError(''); // limpiar error
    setSolicitudTemp([...solicitudTemp, { categoria, recurso, cantidad }]);
    setRecurso('');
    setCantidad(1);
  };

  //----------> editar el  campo en la tabla temporal
  const handleEdit = (index, field, value) => {
    const updated = [...solicitudTemp];
    updated[index][field] = value;
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
    if (solicitudTemp.length === 0) {
      setError('Debes agregar al menos un recurso antes de guardar.');
      return;
    }
    setError('');
    const nueva = {
      descripcion: `Solicitud de ${solicitudTemp.length} recursos`,
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
          {error && <Alert variant="danger">{error}</Alert>} {/* <-- mostramos error */}

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Categoría</Form.Label>
                <Form.Select 
                  value={categoria} 
                  onChange={e => { setCategoria(e.target.value); setRecurso(''); }} 
                  required
                >
                  <option value="">Seleccione</option>
                  {Object.keys(recursosPorCategoria).map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Recurso</Form.Label>
                <Form.Select 
                  value={recurso} 
                  onChange={e => setRecurso(e.target.value)} 
                  disabled={!categoria} 
                  required
                >
                  <option value="">Seleccione</option>
                  {(recursosPorCategoria[categoria] || []).map((rec, i) => <option key={i} value={rec}>{rec}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Cantidad</Form.Label>
                <Form.Control 
                  type="number" 
                  value={cantidad} 
                  min={1} 
                  onChange={e => setCantidad(Number(e.target.value))} 
                  required
                />
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
                      <Form.Select 
                        value={r.categoria} 
                        onChange={(e) => handleEdit(i, 'categoria', e.target.value)} 
                        required
                      >
                        <option value="">Seleccione</option>
                        {Object.keys(recursosPorCategoria).map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Select 
                        value={r.recurso} 
                        onChange={(e) => handleEdit(i, 'recurso', e.target.value)} 
                        disabled={!r.categoria} 
                        required
                      >
                        <option value="">Seleccione</option>
                        {(recursosPorCategoria[r.categoria] || []).map((rec, idx) => <option key={idx} value={rec}>{rec}</option>)}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control 
                        type="number" 
                        value={r.cantidad} 
                        min={1} 
                        onChange={(e) => handleEdit(i, 'cantidad', Number(e.target.value))} 
                        required
                      />
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