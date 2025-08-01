import React, { useState } from "react";
import { Table, Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const InformesRecursos = () => {
  const [datos, setDatos] = useState([
    { categoria: "Papeleria", recurso: "Hoja carta", unidad: "Paquete", cantidad: 15, fecha: "2025-07-01" },
    { categoria: "Material de Limpieza", recurso: "Escoba", unidad: "Pieza", cantidad: 20, fecha: "2025-07-10" },
    { categoria: "Insumos de oficina", recurso: "Toner", unidad: "Cartucho", cantidad: 10, fecha: "2025-07-05" },
    { categoria: "Consumibles", recurso: "Galletas", unidad: "Caja", cantidad: 25, fecha: "2025-07-15" },
    { categoria: "Consumibles", recurso: "Refrescos", unidad: "Botella", cantidad: 12, fecha: "2025-07-20" },
  ]);

  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroRecurso, setFiltroRecurso] = useState("");
  const [error, setError] = useState("");


  const validarDatos = () => {
    for (let item of datos) {
      if (!item.categoria || !item.recurso || !item.unidad || !item.cantidad) {
        setError("Todos los campos (Categoría, Recurso, Unidad y Cantidad) son obligatorios.");
        return false;
      }
    }
    setError("");
    return true;
  };


  const datosFiltrados = datos.filter((item) => {
    return (
      (filtroCategoria ? item.categoria === filtroCategoria : true) &&
      (filtroRecurso ? item.recurso === filtroRecurso : true)
    );
  });


  const categoriasAgrupadas = datosFiltrados.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {});

  const totalGeneral = datosFiltrados.reduce((sum, item) => sum + Number(item.cantidad), 0);

 
  const categoriasUnicas = [...new Set(datos.map((d) => d.categoria))];
  const recursosUnicos = [
    ...new Set(
      datos
        .filter((d) => (filtroCategoria ? d.categoria === filtroCategoria : true))
        .map((d) => d.recurso)
    ),
  ];

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
        item.unidad,
        item.cantidad,
      ]);

      doc.autoTable({
        head: [["Recurso", "Unidad de Medida", "Cantidad"]],
        body: rows,
        startY: finalY,
        theme: "grid",
      });

      finalY = doc.lastAutoTable.finalY + 10;
    });

    doc.text(`Total General: ${totalGeneral}`, 14, finalY);
    doc.save(`informe_recursos_${filtroRecurso || "general"}.pdf`);
  };

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

      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={6}>
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
            <Col md={6}>
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
          </Row>
          <div className="mt-3 text-end">
            <Button
              variant="secondary"
              onClick={() => {
                setFiltroCategoria("");
                setFiltroRecurso("");
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </Card.Body>
      </Card>

    
      <div className="mb-3">
        <h5>Descarga General</h5>
        <Button variant="success" className="me-2" onClick={exportarExcel}>
          Excel
        </Button>
        <Button variant="danger" onClick={exportarPDF}>
          PDF
        </Button>
      </div>

      
      <Row>
        {Object.keys(categoriasAgrupadas).length === 0 ? (
          <p>No hay datos con los filtros seleccionados.</p>
        ) : (
          Object.keys(categoriasAgrupadas).map((categoria, index) => (
            <Col
              md={filtroCategoria || filtroRecurso ? 12 : 6}
              key={index}
              className="mb-4"
            >
              <Card>
                <Card.Header as="h5">{categoria}</Card.Header>
                <Card.Body>
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Recurso</th>
                          <th>Unidad de Medida</th>
                          <th>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoriasAgrupadas[categoria].map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.recurso}</td>
                            <td>{item.unidad}</td>
                            <td>{Number(item.cantidad)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <p>
                    <strong>
                      Total en {categoria}:{" "}
                      {categoriasAgrupadas[categoria].reduce((sum, i) => sum + Number(i.cantidad), 0)}
                    </strong>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

 
    </div>
  );
};

export default InformesRecursos;