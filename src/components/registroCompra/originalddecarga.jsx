import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, Modal, InputGroup, Pagination, Row, Col
} from 'react-bootstrap';
import {
  BsPencilFill, BsTrashFill, BsSearch, BsPlusLg, BsDownload,
  BsFileEarmarkPdfFill, BsFileEarmarkCodeFill, BsSlashCircle
} from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

const initialData = [
  {
    id: 1,
    cable: 'Cable g',
    tipo: 'HDMI',
    recurso: 'Monitor',
    descripcion: 'Monitor de 24 pulgadas',
    fecha: '2024-01-10',
    cantidad: 10,
    precio: 120.00,
    xmlFile: null,
    pdfFile: null,
    activo: true
  },
  {
    id: 2,
    cable: 'Cable B',
    tipo: 'USB',
    recurso: 'Teclado',
    descripcion: 'Teclado mecánico',
    fecha: '2024-02-14',
    cantidad: 5,
    precio: 35.00,
    xmlFile: null,
    pdfFile: null,
    activo: true
  },
  {
    id: 3,
    cable: 'Cable C',
    tipo: 'Ethernet',
    recurso: 'Router',
    descripcion: 'Router doble banda',
    fecha: '2024-03-01',
    cantidad: 8,
    precio: 60.00,
    xmlFile: null,
    pdfFile: null,
    activo: false
  },
];

const Registro = () => {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [toggleItem, setToggleItem] = useState(null);
  const [toggleReason, setToggleReason] = useState('');

  const filteredData = data.filter(item => {
    const matchesSearch =
      item.cable.toLowerCase().includes(search.toLowerCase()) ||
      item.tipo.toLowerCase().includes(search.toLowerCase()) ||
      item.recurso.toLowerCase().includes(search.toLowerCase()) ||
      item.descripcion?.toLowerCase().includes(search.toLowerCase());

    const itemDate = new Date(item.fecha);
    const from = fechaInicio ? new Date(fechaInicio) : null;
    const to = fechaFin ? new Date(fechaFin) : null;

    const inDateRange =
      (!from || itemDate >= from) &&
      (!to || itemDate <= to);

    return matchesSearch && inDateRange;
  });

  const toggleRow = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const allIds = filteredData.map(item => item.id);
    const allSelected = allIds.every(id => selectedItems.includes(id));
    setSelectAll(allSelected);
  }, [selectedItems, filteredData]);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    const filteredIds = filteredData.map(item => item.id);
    setSelectedItems(prev =>
      checked
        ? Array.from(new Set([...prev, ...filteredIds]))
        : prev.filter(id => !filteredIds.includes(id))
    );
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingItem.id) {
      setData(prev =>
        prev.map(item => item.id === editingItem.id ? editingItem : item)
      );
    } else {
      setData(prev => [...prev, { ...editingItem, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Deseas eliminar este recurso?')) {
      setData(prev => prev.filter(item => item.id !== id));
      setSelectedItems(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const getSelectedOrFilteredData = () =>
    selectedItems.length > 0
      ? data.filter(item => selectedItems.includes(item.id))
      : filteredData;

  const exportCSV = () => {
    const exportData = getSelectedOrFilteredData();
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'recursos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const exportData = getSelectedOrFilteredData();
    const doc = new jsPDF();
    doc.text('Listado de Recursos', 14, 10);
    doc.autoTable({
      startY: 20,
      head: [['Cable', 'Tipo', 'Recurso', 'Descripción', 'Fecha', 'Cantidad', 'Precio']],
      body: exportData.map(item => [
        item.cable,
        item.tipo,
        item.recurso,
        item.descripcion || '',
        item.fecha,
        item.cantidad,
        `$${item.precio.toFixed(2)}`
      ])
    });
    doc.save('recursos.pdf');
  };

  const handleFileUpload = (id, type, file) => {
    const fileURL = URL.createObjectURL(file);
    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [`${type}File`]: fileURL } : item
      )
    );
  };

  const handleToggleStatus = () => {
    if (!toggleItem) return;
    setData(prev =>
      prev.map(item =>
        item.id === toggleItem.id
          ? { ...item, activo: !item.activo, motivo: toggleReason }
          : item
      )
    );
    setShowToggleModal(false);
    setToggleItem(null);
    setToggleReason('');
  };

  const toggleActivo = (id) => {
    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, activo: !item.activo } : item
      )
    );
  };

  return (
  <div className="container py-4">
    <h4 className="fw-bold mb-3">Recursos</h4>
    <Row className="g-3 mb-3">
      <Col md={4}>
        <InputGroup>
          <Form.Control
            placeholder="Buscar recurso, tipo, descripción o cable..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <InputGroup.Text className="bg-dark text-white">
            <BsSearch />
          </InputGroup.Text>
        </InputGroup>
      </Col>
      <Col md={3}>
        <Form.Control
          type="date"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
        />
      </Col>
      <Col md={3}>
        <Form.Control
          type="date"
          value={fechaFin}
          onChange={e => setFechaFin(e.target.value)}
        />
      </Col>
      <Col className="d-flex gap-2 justify-content-end">
        <Button variant="primary" onClick={() => {
          setEditingItem(null);
          setShowModal(true);
        }}>
          <BsPlusLg className="me-1" /> Agregar
        </Button>
        <Button variant="success" onClick={exportCSV} disabled={selectedItems.length === 0}>
          <BsDownload className="me-1" /> CSV
        </Button>
        <Button variant="danger" onClick={exportPDF} disabled={selectedItems.length === 0}>
          <BsDownload className="me-1" /> PDF
        </Button>
      </Col>
    </Row>

    <div className="table-responsive">
      <Table bordered hover>
        <thead className="table-primary text-center align-middle">
          <tr>
            <th><Form.Check type="checkbox" checked={selectAll} onChange={e => handleSelectAll(e.target.checked)} /></th>
            <th>Cable</th>
            <th>Tipo</th>
            <th>Recurso</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {filteredData.map(item => (
            <tr key={item.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleRow(item.id)}
                />
              </td>
              <td>{item.cable}</td>
              <td>{item.tipo}</td>
              <td>{item.recurso}</td>
              <td>{item.descripcion}</td>
              <td>{item.fecha}</td>
              <td>{item.cantidad}</td>
              <td>${item.precio.toFixed(2)}</td>
              <td>
                <span
                  style={{
                    color: '#fff',
                    backgroundColor: item.activo ? '#f9b91b' : '#a8a8a8',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    minWidth: '80px',
                    textAlign: 'center'
                  }}
                >
                  {item.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="d-flex flex-column gap-1 align-items-center">
                <Button size="sm" variant="dark" onClick={() => handleEdit(item)}>
                  <BsPencilFill />
                </Button>

                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDelete(item.id)}
                  style={{ color: '#e52122', borderColor: '#e52122' }}
                >
                  <BsTrashFill />
                </Button>

                <Button
                  size="sm"
                  variant="outline-warning"
                  onClick={() => {
                    setToggleItem(item);
                    setShowToggleModal(true);
                  }}
                  style={{ color: '#ee722d', borderColor: '#ee722d' }}
                >
                  <BsSlashCircle />
                </Button>

                {/* XML */}
                {!item.xmlFile ? (
                  <Form.Group className="mb-1">
                    <Form.Control
                      type="file"
                      accept=".xml"
                      onChange={e => handleFileUpload(item.id, 'xml', e.target.files[0])}
                      size="sm"
                    />
                  </Form.Group>
                ) : (
                  <Button
                    size="sm"
                    variant="outline-primary"
                    href={item.xmlFile}
                    download={`archivo-${item.id}.xml`}
                    title="Descargar XML"
                  >
                    <BsFileEarmarkCodeFill />
                  </Button>
                )}

                {/* PDF */}
                {!item.pdfFile ? (
                  <Form.Group className="mb-1">
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={e => handleFileUpload(item.id, 'pdf', e.target.files[0])}
                      size="sm"
                    />
                  </Form.Group>
                ) : (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    href={item.pdfFile}
                    download={`archivo-${item.id}.pdf`}
                    title="Descargar PDF"
                  >
                    <BsFileEarmarkPdfFill />
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr><td colSpan={10} className="text-center py-4">No hay registros.</td></tr>
          )}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>{editingItem?.id ? 'Editar Recurso' : 'Agregar Recurso'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-2">
        <Form.Label>Cable</Form.Label>
        <Form.Control
          value={editingItem?.cable || ''}
          onChange={e => setEditingItem({ ...editingItem, cable: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Tipo</Form.Label>
        <Form.Control
          value={editingItem?.tipo || ''}
          onChange={e => setEditingItem({ ...editingItem, tipo: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Recurso</Form.Label>
        <Form.Control
          value={editingItem?.recurso || ''}
          onChange={e => setEditingItem({ ...editingItem, recurso: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          value={editingItem?.descripcion || ''}
          onChange={e => setEditingItem({ ...editingItem, descripcion: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="date"
          value={editingItem?.fecha || ''}
          onChange={e => setEditingItem({ ...editingItem, fecha: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Cantidad</Form.Label>
        <Form.Control
          type="number"
          value={editingItem?.cantidad || ''}
          onChange={e => setEditingItem({ ...editingItem, cantidad: Number(e.target.value) })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Precio</Form.Label>
        <Form.Control
          type="number"
          value={editingItem?.precio || ''}
          onChange={e => setEditingItem({ ...editingItem, precio: parseFloat(e.target.value) })}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
    <Button variant="primary" onClick={handleSave}>Guardar</Button>
  </Modal.Footer>
</Modal>

<Modal show={showToggleModal} onHide={() => setShowToggleModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>
      {toggleItem?.activo ? 'Desactivar Recurso' : 'Activar Recurso'}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {toggleItem?.activo ? (
      <>
        <p>¿Estás seguro que deseas <strong>desactivar</strong> este recurso?</p>
        <Form.Group className="mb-2">
          <Form.Label>Motivo de desactivación</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={toggleReason}
            onChange={e => setToggleReason(e.target.value)}
          />
        </Form.Group>
      </>
    ) : (
      <p>¿Deseas volver a <strong>activar</strong> este recurso?</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowToggleModal(false)}>Cancelar</Button>
    <Button variant="warning" onClick={handleToggleStatus}>
      {toggleItem?.activo ? 'Desactivar' : 'Activar'}
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default Registro;