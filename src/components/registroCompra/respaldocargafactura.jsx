import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, Modal, InputGroup, Pagination, Row, Col
} from 'react-bootstrap';
import {
  BsPencilFill, BsTrashFill, BsSearch, BsPlusLg, BsDownload, BsSlashCircle,
  BsFileEarmarkPdfFill, BsFileEarmarkCodeFill
} from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { parseStringPromise } from 'xml2js';
import { XMLParser } from 'fast-xml-parser';

const initialData = [];

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
  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [facturaRows, setFacturaRows] = useState([]);
  const [pdfFactura, setPdfFactura] = useState(null);

  const filteredData = data.filter(item => {
    const matchesSearch =
      item.cable?.toLowerCase().includes(search.toLowerCase()) ||
      item.tipo?.toLowerCase().includes(search.toLowerCase()) ||
      item.recurso?.toLowerCase().includes(search.toLowerCase()) ||
      item.descripcion?.toLowerCase().includes(search.toLowerCase());

    const itemDate = new Date(item.fecha);
    const from = fechaInicio ? new Date(fechaInicio) : null;
    const to = fechaFin ? new Date(fechaFin) : null;

    const inDateRange =
      (!from || itemDate >= from) &&
      (!to || itemDate <= to);

    return matchesSearch && inDateRange;
  });

  useEffect(() => {
    const allIds = filteredData.map(item => item.id);
    const allSelected = allIds.every(id => selectedItems.includes(id));
    setSelectAll(allSelected);
  }, [selectedItems, filteredData]);

  const toggleRow = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

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
      item.cable || '',
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
const handleXMLUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const xmlText = event.target.result;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
      });

      const result = parser.parse(xmlText);
      console.log('✅ XML Parseado:', result);

      // Detectar el nodo Comprobante sin importar el prefijo
      const comprobanteKey = Object.keys(result).find(k => k.toLowerCase().includes('comprobante'));
      const comprobante = result[comprobanteKey];

      const conceptosWrapperKey = Object.keys(comprobante).find(k => k.toLowerCase().includes('conceptos'));
      const conceptosWrapper = comprobante[conceptosWrapperKey];

      const conceptoKey = Object.keys(conceptosWrapper).find(k => k.toLowerCase().includes('concepto'));
      const conceptos = conceptosWrapper[conceptoKey];
      const conceptosArray = Array.isArray(conceptos) ? conceptos : [conceptos];

      const fecha = comprobante['@_Fecha']?.substring(0, 10) || '';

      const rows = conceptosArray.map((c) => ({
        clave: c['@_ClaveProdServ'] || 'N/A',
        tipo: c['@_Unidad'] || 'N/A',
        recurso: c['@_Descripcion']?.split(' ')[0] || '',
        descripcion: c['@_Descripcion'] || '',
        fecha: fecha,
        cantidad: Number(c['@_Cantidad']) || 1,
        precio: parseFloat(c['@_ValorUnitario']) || 0
      }));

      console.log('✅ Datos extraídos:', rows);
      setFacturaRows(rows);
    } catch (error) {
      console.error('❌ Error al procesar XML:', error.message, error);
      alert('Error al leer el archivo XML.');
    }
  };
  reader.readAsText(file);
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
          <Form.Control type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Control type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </Col>
        <Col className="d-flex gap-2 justify-content-end">
          <Button variant="primary" onClick={() => { setEditingItem(null); setShowModal(true); }}>
            <BsPlusLg className="me-1" /> Agregar
          </Button>
          <Button variant="secondary" onClick={() => setShowFacturaModal(true)}>
            <BsPlusLg className="me-1" /> Cargar Factura
          </Button>
          <Button variant="success" onClick={exportCSV} disabled={selectedItems.length === 0}>
            <BsDownload className="me-1" /> CSV
          </Button>
          <Button variant="danger" onClick={exportPDF} disabled={selectedItems.length === 0}>
            <BsDownload className="me-1" /> PDF
          </Button>
        </Col>
      </Row>

      {/* Aquí puedes conservar tu tabla y modales previos como ya estaban */}

      {/* Modal de Factura */}
      <Modal size="lg" show={showFacturaModal} onHide={() => setShowFacturaModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cargar Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Seleccionar XML</Form.Label>
            <Form.Control type="file" accept=".xml" onChange={handleXMLUpload} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Seleccionar PDF</Form.Label>
            <Form.Control type="file" accept=".pdf" onChange={(e) => setPdfFactura(e.target.files[0])} />
          </Form.Group>

          <Table bordered className="text-center">
            <thead className="table-warning">
              <tr>
                <th>Clave</th>
                <th>Tipo</th>
                <th>Recurso</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {facturaRows.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.clave}</td>
                  <td>
                    <Form.Control value={item.tipo} onChange={e => {
                      const copy = [...facturaRows];
                      copy[idx].tipo = e.target.value;
                      setFacturaRows(copy);
                    }} />
                  </td>
                  <td>
                    <Form.Control value={item.recurso} onChange={e => {
                      const copy = [...facturaRows];
                      copy[idx].recurso = e.target.value;
                      setFacturaRows(copy);
                    }} />
                  </td>
                  <td>
                    <Form.Control value={item.descripcion} onChange={e => {
                      const copy = [...facturaRows];
                      copy[idx].descripcion = e.target.value;
                      setFacturaRows(copy);
                    }} />
                  </td>
                  <td>{item.fecha}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>
                    <Button size="sm" variant="danger" onClick={() => {
                      setFacturaRows(facturaRows.filter((_, i) => i !== idx));
                    }}>
                      <BsTrashFill />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFacturaModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={() => {
            const blobUrl = pdfFactura ? URL.createObjectURL(pdfFactura) : null;
            setData(prev => [
              ...prev,
              ...facturaRows.map(row => ({
                id: Date.now() + Math.random(),
                ...row,
                cable: row.clave,
                activo: true,
                xmlFile: null,
                pdfFile: blobUrl
              }))
            ]);
            setFacturaRows([]);
            setPdfFactura(null);
            setShowFacturaModal(false);
          }}>
            Guardar en Recursos
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Registro;
