import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Form,
  InputGroup,
  Badge,
  Modal,
  Row,
  Col,
  Pagination
} from 'react-bootstrap';
import {
  BsPencilFill,
  BsTrashFill,
  BsSearch,
  BsPlusLg,
  BsDownload
} from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

const initialData = [
  { id: 1, clabe: 'clabe A', tipo: 'HDMI', recurso: 'Monitor', fecha: '2024-06-10', cantidad: 10, precio: 120.00 },
  { id: 2, clabe: 'clabe B', tipo: 'USB', recurso: 'Teclado', fecha: '2024-02-14', cantidad: 5, precio: 35.00 },
  { id: 3, clabe: 'clabe C', tipo: 'Ethernet', recurso: 'Router', fecha: '2024-03-01', cantidad: 8, precio: 60.00 },
];

const Registro = () => {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filteredData = data.filter(item =>
    item.clabe.toLowerCase().includes(search.toLowerCase()) ||
    item.tipo.toLowerCase().includes(search.toLowerCase()) ||
    item.recurso.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRow = (id) => {
    setSelectedItems(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      return updated;
    });
  };

  useEffect(() => {
    const allIds = filteredData.map(item => item.id);
    const allSelected = allIds.every(id => selectedItems.includes(id));
    setSelectAll(allSelected);
  }, [selectedItems, filteredData]);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      const allFilteredIds = filteredData.map(item => item.id);
      setSelectedItems(prev => Array.from(new Set([...prev, ...allFilteredIds])));
    } else {
      const filteredIds = filteredData.map(item => item.id);
      setSelectedItems(prev => prev.filter(id => !filteredIds.includes(id)));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = () => {
    setData(prev =>
      prev.map(item => item.id === editingItem.id ? editingItem : item)
    );
    setShowModal(false);
  };

  const getSelectedOrFilteredData = () => {
    return selectedItems.length > 0
      ? data.filter(item => selectedItems.includes(item.id))
      : filteredData;
  };

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
      head: [['clabe', 'Tipo', 'Recurso', 'Fecha', 'Cantidad', 'Precio']],
      body: exportData.map(item => [
        item.clabe,
        item.tipo,
        item.recurso,
        item.fecha,
        item.cantidad,
        `$${item.precio.toFixed(2)}`
      ])
    });
    doc.save('recursos.pdf');
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-3">Recursos</h4>
      <Row className="align-items-end mb-3 g-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar recurso, tipo o clabe..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <InputGroup.Text className="bg-dark text-white">
              <BsSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col className="d-flex gap-2 justify-content-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>
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
              <th>
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>clabe</th>
              <th>Tipo</th>
              <th>Recurso</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredData.map(item => (
              <tr key={item.id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleRow(item.id)}
                  />
                </td>
                <td>{item.clabe}</td>
                <td>{item.tipo}</td>
                <td>{item.recurso}</td>
                <td>{item.fecha}</td>
                <td>{item.cantidad}</td>
                <td>${item.precio.toFixed(2)}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button size="sm" variant="dark" onClick={() => handleEdit(item)}>
                      <BsPencilFill />
                    </Button>
                    <Button size="sm" variant="dark">
                      <BsTrashFill />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No hay registros.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Pagination className="justify-content-end">
        <Pagination.Prev disabled />
        <Pagination.Item active>1</Pagination.Item>
        <Pagination.Next disabled />
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Editar Recurso' : 'Agregar Recurso'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>clabe</Form.Label>
              <Form.Control
                value={editingItem?.clabe || ''}
                onChange={(e) => setEditingItem({ ...editingItem, clabe: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                value={editingItem?.tipo || ''}
                onChange={(e) => setEditingItem({ ...editingItem, tipo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Recurso</Form.Label>
              <Form.Control
                value={editingItem?.recurso || ''}
                onChange={(e) => setEditingItem({ ...editingItem, recurso: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={editingItem?.fecha || ''}
                onChange={(e) => setEditingItem({ ...editingItem, fecha: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                value={editingItem?.cantidad || ''}
                onChange={(e) => setEditingItem({ ...editingItem, cantidad: Number(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={editingItem?.precio || ''}
                onChange={(e) => setEditingItem({ ...editingItem, precio: parseFloat(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Registro;