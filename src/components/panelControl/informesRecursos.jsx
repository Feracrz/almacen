import React, { useState } from "react";
import { Table, Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const InformesRecursos = () => {
  const [datos, setDatos] = useState([
    { categoria: "Papeleria", recurso: "Hoja carta", cantidad: 15, fecha: "2025-07-01" },
    { categoria: "Material de Limpieza", recurso: "Escoba", cantidad: 20, fecha: "2025-07-10" },
    { categoria: "Insumos de oficina", recurso: "Toner", cantidad: 10, fecha: "2025-07-05" },
    { categoria: "Consumibles", recurso: "Galletas", cantidad: 25, fecha: "2025-07-15" },
    { categoria: "Consumibles", recurso: "Refrescos", cantidad: 12, fecha: "2025-07-20" },
  ]);

  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroRecurso, setFiltroRecurso] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [error, setError] = useState("");

  // Validar datos antes de exportar
  const validarDatos = () => {
    for (let item of datos) {
      if (!item.categoria || !item.recurso || !item.cantidad || !item.fecha) {
        setError("Todos los campos (Categoría, Recurso, Cantidad y Fecha) son obligatorios.");
        return false;
      }
    }
    setError("");
    return true;
  };

  // Filtrar datos según filtros
  const datosFiltrados = datos.filter((item) => {
    const fechaItem = new Date(item.fecha);
    const desde = fechaInicio ? new Date(fechaInicio) : null;
    const hasta = fechaFin ? new Date(fechaFin) : null;

    return (
      (filtroCategoria ? item.categoria === filtroCategoria : true) &&
      (filtroRecurso ? item.recurso === filtroRecurso : true) &&
      (!desde || fechaItem >= desde) &&
      (!hasta || fechaItem <= hasta)
    );
  });

  // Agrupar por categoría
  const categoriasAgrupadas = datosFiltrados.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {});

  // Totales
  const totalGeneral = datosFiltrados.reduce((sum, item) => sum + item.cantidad, 0);

  // Listas únicas
  const categoriasUnicas = [...new Set(datos.map((d) => d.categoria))];
  const recursosUnicos = [
    ...new Set(
      datos
        .filter((d) => (filtroCategoria ? d.categoria === filtroCategoria : true))
        .map((d) => d.recurso)
    ),
  ];

  // Exportar PDF
  const exportarPDF = () => {
    if (!validarDatos()) return;

    const doc = new jsPDF();
    doc.text("Informe de Recursos", 14, 10);
    let finalY = 20;

    Object.keys(categoriasAgrupadas).forEach((categoria) => {
      doc.text(`Categoría: ${categoria}`, 14, finalY);
      finalY += 6;

      const rows = categoriasAgrupadas[categoria].map((item) => [
        item.recurso,
        item.cantidad,
        item.fecha,
      ]);

      doc.autoTable({
        head: [["Recurso", "Cantidad", "Fecha"]],
        body: rows,
        startY: finalY,
        theme: "grid",
      });

      finalY = doc.lastAutoTable.finalY + 10;
    });

    doc.text(`Total General: ${totalGeneral}`, 14, finalY);
    doc.save(`informe_recursos_${filtroRecurso || "general"}.pdf`);
  };

  // Exportar Excel
  const exportarExcel = () => {
    if (!validarDatos()) return;

    const hoja = XLSX.utils.json_to_sheet(datosFiltrados);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Informe");
    XLSX.writeFile(libro, `informe_recursos_${filtroRecurso || "general"}.xlsx`);
  };

  return (
    <div className="container-fluid mt-4">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filtros */}
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <option value="">Todas</option>
                  {categoriasUnicas.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Recurso</Form.Label>
                <Form.Select
                  value={filtroRecurso}
                  onChange={(e) => setFiltroRecurso(e.target.value)}
                >
                  <option value="">Todos</option>
                  {recursosUnicos.map((rec, i) => (
                    <option key={i} value={rec}>{rec}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Desde</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Hasta</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3 text-end">
            <Button
              variant="secondary"
              onClick={() => {
                setFiltroCategoria("");
                setFiltroRecurso("");
                setFechaInicio("");
                setFechaFin("");
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Botones de exportación */}
      <div className="mb-3">
        <h5>Descarga General</h5>
        <Button variant="success" className="me-2" onClick={exportarExcel}>
          Excel
        </Button>
        <Button variant="danger" onClick={exportarPDF}>
          PDF
        </Button>
      </div>

      {/* Tablas agrupadas */}
      <Row>
        {Object.keys(categoriasAgrupadas).length === 0 ? (
          <p>No hay datos con los filtros seleccionados.</p>
        ) : (
          Object.keys(categoriasAgrupadas).map((categoria, index) => (
            <Col md={6} key={index} className="mb-4">
              <Card>
                <Card.Header as="h5">{categoria}</Card.Header>
                <Card.Body>
                  <div className="table-responsive" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Recurso</th>
                          <th>Cantidad</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoriasAgrupadas[categoria].map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.recurso}</td>
                            <td>{item.cantidad}</td>
                            <td>{item.fecha}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <p>
                    <strong>
                      Total en {categoria}:{" "}
                      {categoriasAgrupadas[categoria].reduce((sum, i) => sum + i.cantidad, 0)}
                    </strong>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Total general */}
      <Card className="mt-4">
        <Card.Body>
          <h4>Total general de recursos: {totalGeneral}</h4>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InformesRecursos;