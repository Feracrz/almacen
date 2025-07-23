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
  //Validacion de factura
  const [facturaRows, setFacturaRows] = useState([]);
  const [pdfFactura, setPdfFactura] = useState(null);
  // error de  validacion para  desactivacion
  const [toggleReasonError, setToggleReasonError] = useState(false); 
  //valiacion de input de cantidad total
  const [validated, setValidated] = useState(false);
  //buscadores
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [recursoFiltro, setRecursoFiltro] = useState('');
  const filteredData = data.filter(item => {
  const texto = `${item.tipo} ${item.recurso} ${item.descripcion} ${item.categoria} ${item.cantidadtotal}`.toLowerCase();
  const matchesSearch = texto.includes(search.toLowerCase());
  //selects de  factura obligatorios
  const matchesCategoria = categoriaFiltro ? item.categoria === categoriaFiltro : true;
  const matchesRecurso = recursoFiltro
  ? item.recurso?.toLowerCase().trim() === recursoFiltro.toLowerCase().trim()
  : true;
  const itemDate = new Date(item.fecha);
  const from = fechaInicio ? new Date(fechaInicio) : null;
  const to = fechaFin ? new Date(fechaFin) : null;
  const inDateRange =
    (!from || itemDate >= from) &&
    (!to || itemDate <= to);
  return matchesSearch && matchesCategoria && matchesRecurso && inDateRange;

  //
});

  
//paginacion 
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
// Cálculo de páginas
const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
const totalPages = Math.ceil(filteredData.length / itemsPerPage);
// Cambiar de página
const handlePageChange = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};


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

  if (exportData.length === 0) {
    alert('No hay datos para exportar.');
    return;
  }

  const doc = new jsPDF();
  doc.text('Listado de Recursos', 14, 10);

  autoTable(doc, {
    startY: 20,
    head: [[ 'Uuid', 'Categoría', 'Recurso', 'Descripción', 'Unidad', 'Cantidad', 'Precio Unitario', 'Precio Total', 'Fecha']],
    body: exportData.map(item => [
      item.uuid || '', 
      item.categoria || '',
      item.recurso || '',
      item.descripcion || '',
      item.tipo || '',
      item.cantidad || 0,
      item.cantidadtotal || '', 
      `$${(item.valoruni || 0).toFixed(2)}`,
      `$${(item.importe || 0).toFixed(2)}`,
      item.fecha || ''
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] }
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
  if (toggleItem?.activo && toggleReason.trim() === '') {
    setToggleReasonError(true);
    return;
  }

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
  setToggleReasonError(false); // Reset error
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
      const fechaFactura = comprobante['@_Fecha']?.substring(0, 10) || '';
      const emisorKey = Object.keys(comprobante).find(k => k.toLowerCase().includes('emisor'));
      const emisor = comprobante[emisorKey];


      //Busqueda del nodo donde estan el dato de  uuid
      const complementoKey = Object.keys(comprobante).find(k => k.toLowerCase().includes('complemento'));
      const complemento = comprobante[complementoKey] || {};
      //Hace la busqueda el  uuid 
      const timbreKey = Object.keys(complemento).find(k => k.toLowerCase().includes('timbrefiscaldigital'));
      const timbre = complemento[timbreKey] || {};
      const uuid = timbre['@_UUID'] || ''; //----> obteniendo el  uuid

      const conceptosWrapperKey = Object.keys(comprobante).find(k => k.toLowerCase().includes('conceptos'));
      const conceptosWrapper = comprobante[conceptosWrapperKey];
      const conceptoKey = Object.keys(conceptosWrapper).find(k => k.toLowerCase().includes('concepto'));
      const conceptos = conceptosWrapper[conceptoKey];
      const conceptosArray = Array.isArray(conceptos) ? conceptos : [conceptos];
      
      const emisorEntry = Object.entries(comprobante).find(([key]) =>
           key.toLowerCase().includes('emisor')
            );
      const proveedorNombre = emisor?.['@_Nombre'] || '';
      const rows = conceptosArray.map((c) => ({
        uuid: uuid, 
        tipo: c['@_Unidad'] || 'N/A',
        descripcion: c['@_Descripcion'] || '',
        importe: parseFloat(c['@_Importe']) || 0,
        cantidad: Number(c['@_Cantidad']) || 1,
        valoruni: parseFloat(c['@_ValorUnitario']) || 0,
        provedor: proveedorNombre,
        fecha: fechaFactura
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
const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  }; //-------> Validacion de campo obligatorio para input de cantidad total

  const handleLimpiarFiltros = () => {
  setSearch('');
  setCategoriaFiltro('');
  setRecursoFiltro('');
  setFechaInicio('');
  setFechaFin('');
  setCurrentPage(1);
};



  return (
    <div className="container-fluid py-4">
      <h4 className="fw-bold mb-3">Recursos</h4>
      <Row className="g-3 mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar recurso, tipo, descripción "
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <InputGroup.Text className="bg-dark text-white">
              <BsSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={3}>
  <Form.Select
    value={categoriaFiltro}
    onChange={e => setCategoriaFiltro(e.target.value)}
  >
    <option value="">Todas las categorías</option>
    {Object.keys(recursosPorCategoria).map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </Form.Select>
</Col>
<Col md={2}>
  <Form.Select
  value={recursoFiltro}
  onChange={e => setRecursoFiltro(e.target.value)}
>
  <option value="">Todos los recursos</option>
  {Object.values(recursosPorCategoria).flat().map((recurso, idx) => (
    <option key={idx} value={recurso}>{recurso}</option>
  ))}
</Form.Select>
</Col>
        <Col md={3}>
          <Form.Control type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Control type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </Col>
        <Col className="d-flex gap-2 justify-content-end">
          {/*<Button variant="primary" onClick={() => { setEditingItem(null); setShowModal(true); }}>
            <BsPlusLg className="me-1" /> Agregar 
          </Button>*/}
          <Button variant='primary' onClick={handleLimpiarFiltros}>
            Limpiar Filtros
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
            {/* Modal de Factura */}
      <Modal size="xl" show={showFacturaModal} onHide={() => setShowFacturaModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Cargar Factura</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group className="mb-3">
      <Form.Label>Seleccionar XML <span className="text-danger">*</span></Form.Label>
      <Form.Control
        type="file"
        accept=".xml"
        onChange={handleXMLUpload}
        isInvalid={facturaRows.length === 0}
      />
      <Form.Control.Feedback type="invalid">
        Debes cargar un archivo XML válido.
      </Form.Control.Feedback>
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Seleccionar PDF <span className="text-danger">*</span></Form.Label>
      <Form.Control
        type="file"
        accept=".pdf"
        onChange={(e) => setPdfFactura(e.target.files[0])}
        isInvalid={!pdfFactura}
      />
      <Form.Control.Feedback type="invalid">
        Debes cargar un archivo PDF.
      </Form.Control.Feedback>
    </Form.Group>

    {/* nombre del provedor y  fecha de la  factura  */}
    <div className="mb-3">
      <strong>Proveedor:</strong> {facturaRows[0]?.provedor || 'N/A'}<br />
      <strong>Fecha de factura:</strong> {facturaRows[0]?.fecha || 'N/A'}<br />
      <strong>UUID: </strong> {facturaRows[0]?.uuid || 'Dato no disponible'}
    </div>

    <Table bordered className="text-center">
      <thead className="table-warning">
        <tr>
          <th>Categoria <span className="text-danger">*</span></th>
          <th>Recurso <span className="text-danger">*</span></th>
          <th>Descripción</th>
          <th>Unidad de medida</th>
          <th>Precio unitario</th>
          <th>Precio total</th>
          <th>Cantidad</th>
          <th>Cantidad Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {facturaRows.map((item, idx) => (
          <tr key={idx}>
            
            <td>
              <Form.Select
                value={item.categoria || ''}
                onChange={e => {
                  const copy = [...facturaRows];
                  copy[idx].categoria = e.target.value;
                  setFacturaRows(copy);
                }}
                isInvalid={!item.categoria}
              >
                <option value="">Seleccione...</option>
                {Object.keys(recursosPorCategoria).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </td>
            <td>
              <Form.Select
                value={item.recurso || ''}
                onChange={e => {
                  const copy = [...facturaRows];
                  copy[idx].recurso = e.target.value;
                  setFacturaRows(copy);
                }}
                isInvalid={!item.recurso}
              >
                <option value="">Seleccione...</option>
                {(recursosPorCategoria[item.categoria] || []).map((recurso, i) => (
                  <option key={i} value={recurso}>{recurso}</option>
                ))}
              </Form.Select>
            </td>
            <td><Form.Control value={item.descripcion} onChange={e => {
              const copy = [...facturaRows];
              copy[idx].descripcion = e.target.value;
              setFacturaRows(copy);
            }} /></td>
            <td><Form.Control value={item.tipo} onChange={e => {
              const copy = [...facturaRows];
              copy[idx].tipo = e.target.value;
              setFacturaRows(copy);
            }} /></td>
            <td>${item.valoruni.toFixed(2)}</td>
            <td>${item.cantidad.toFixed(2)}</td>
            <td>{item.cantidad}</td>
            <td>
               <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId="formCantidad">  
                  <Form.Control 
                    type="number" 
                    placeholder="Cantidad" 
                    min={1} max={100} 
                required
    value={item.cantidadtotal || ''} 
    onChange={(e) => {
      const copy = [...facturaRows];
      copy[idx].cantidadtotal = Number(e.target.value);
      setFacturaRows(copy);
    }} 
  />
                    {/*<Form.Control.Feedback type="invalid">
                      Por favor, ingresa una cantidad válida.
                    </Form.Control.Feedback>*/}
                </Form.Group>
                </Form>
            </td>
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
    <Button
      type="submit"
      variant="primary"
      onClick={() => {
        if (!pdfFactura || facturaRows.length === 0 || facturaRows.some(r => !r.categoria || !r.recurso)) {
          event.stopPropagation();
          alert('Por favor completa todos los campos obligatorios (XML, PDF, Categoría, Recurso, Cantidad total ).');
          setValidated(true);
          return;
        }
        const blobUrl = pdfFactura ? URL.createObjectURL(pdfFactura) : null;
        setData(prev => [
          ...prev,
          ...facturaRows.map(row => ({
            id: Date.now() + Math.random(),
            ...row,
            cable: row.clave,
            activo: true,
            xmlFile: 'cargado',
            cantidadtotal: row.cantidadtotal || 0,
            pdfFile: blobUrl
            
          }))
        ]);
        setValidated('');
        setFacturaRows([]);
        setPdfFactura(null);
        setShowFacturaModal(false);
      }}
    >
      Guardar en Recursos
    </Button>
  </Modal.Footer>
</Modal>

{/* Aqui mi tabla y modales ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/}
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
        <th>UUID</th>
        <th>Categoria</th>
        <th>Recurso</th>    
        <th>Descripción</th>
        <th>Unidad de medida</th>
        <th>Precio unitario</th>
        <th>Precio total</th>
        <th>Cantidad</th>
        <th>Cantidad Total</th>
        <th>Fecha</th>
        <th>Estatus</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody className="text-center align-middle">
     {paginatedData.map(item => (
        <tr key={item.id}>
          
          <td>
            <Form.Check
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => toggleRow(item.id)}
            />
          </td>
            <td>{item.uuid}</td>

          <td>{item.categoria}</td>
          <td>{item.recurso}</td>
          <td>{item.descripcion}</td>
          <td>{item.tipo}</td>
          <td>${item.valoruni ? item.valoruni.toFixed(2) : '0.00'}</td>
          <td>${item.importe ? item.importe.toFixed(2) : '0.00'}</td>
          <td>{item.cantidad}</td>
          <td>{item.cantidadtotal} </td>
          <td>{item.fecha}</td>
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

            {/* Botón o input para XML */}
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

            {/* Botón o input para PDF */}
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
        <tr>
          <td colSpan={10} className="text-center py-4">
            No hay registros.
          </td>
        </tr>
      )}
<Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>{editingItem?.id ? 'Editar Recurso' : 'Agregar Recurso'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* Categoría */}
      <Form.Group className="mb-2">
        <Form.Label>Categoría <span className="text-danger">*</span></Form.Label>
        <Form.Select
          value={editingItem?.categoria || ''}
          onChange={e => {
            const categoria = e.target.value;
            setEditingItem({
              ...editingItem,
              categoria,
              recurso: '', // Reinicia recurso al cambiar categoría
            });
          }}
          isInvalid={!editingItem?.categoria}
        >
          <option value="">Seleccione una categoría</option>
          {Object.keys(recursosPorCategoria).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          La categoría es obligatoria.
        </Form.Control.Feedback>
      </Form.Group>

      {/* Recurso */}
      <Form.Group className="mb-2">
        <Form.Label>Recurso <span className="text-danger">*</span></Form.Label>
        <Form.Select
          value={editingItem?.recurso || ''}
          onChange={e => setEditingItem({ ...editingItem, recurso: e.target.value })}
          isInvalid={!editingItem?.recurso}
          disabled={!editingItem?.categoria}
        >
          <option value="">Seleccione un recurso</option>
          {(recursosPorCategoria[editingItem?.categoria] || []).map((recurso, i) => (
            <option key={i} value={recurso}>{recurso}</option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          El recurso es obligatorio.
        </Form.Control.Feedback>
      </Form.Group>

      
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
    <Button
      variant="primary"
      onClick={() => {
        if (!editingItem?.categoria || !editingItem?.recurso) {
          alert('Debes completar los campos obligatorios.');
          return;
        }
        handleSave();
      }}
    >
      Guardar
    </Button>
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
  <Form.Label>Motivo de desactivación <span className="text-danger">*</span></Form.Label>
  <Form.Control
    as="textarea"
    rows={3}
    value={toggleReason}
    onChange={e => {
      setToggleReason(e.target.value);
      if (e.target.value.trim() !== '') setToggleReasonError(false);
    }}
    isInvalid={toggleReasonError}
  />
  <Form.Control.Feedback type="invalid">
    Este campo es obligatorio.
  </Form.Control.Feedback>
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
    </tbody>
  </Table>
  <Pagination className="justify-content-center mt-3">
  <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(number => (
    <Pagination.Item
      key={number}
      active={number === currentPage}
      onClick={() => handlePageChange(number)}
    >
      {number}
    </Pagination.Item>
  ))}
  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
  <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
</Pagination>
</div>



    </div>
  );
};

export default Registro;
