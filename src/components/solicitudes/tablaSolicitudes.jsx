import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { BsFileEarmarkPdf, BsEye } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Función para exportar PDF con logo
const exportarPDF = async (solicitud) => {
  const doc = new jsPDF();

  // Cargar logo desde public
  const logoUrl = '/logo.jpg'; // <-- coloca tu logo en public/logo.png
  const img = await fetch(logoUrl).then(r => r.blob()).then(b => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(b);
    });
  });

  // Insertar logo
  doc.addImage(img, 'PNG', 14, 10, 30, 30);

  // Título
  doc.setFontSize(18);
  doc.text("Solicitud de Recursos", 50, 25);

  // Datos generales
  doc.setFontSize(12);
  doc.text(`Descripción: ${solicitud.descripcion}`, 14, 50);
  doc.text(`Fecha: ${solicitud.fecha}`, 14, 60);
  doc.text(`Estatus: ${solicitud.estatus}`, 14, 70);

  // Tabla
  doc.autoTable({
    startY: 80,
    head: [['Categoría', 'Recurso', 'Cantidad']],
    body: solicitud.recursos.map(r => [r.categoria, r.recurso, r.cantidad]),
    theme: 'grid',
    headStyles: { fillColor: [46, 101, 158], textColor: 255 },
    styles: { fontSize: 11 }
  });

  // Descargar PDF
  doc.save(`Solicitud_${solicitud.fecha}.pdf`);
};

const TablaSolicitudes = ({ solicitudes }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleExpand = (index) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Estatus</th>
          <th>Recursos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {solicitudes.map((sol, idx) => {
          const isExpanded = expandedRows.includes(idx);
          const recursosMostrados = isExpanded ? sol.recursos : sol.recursos.slice(0, 2);

          return (
            <tr key={idx}>
              <td>{sol.descripcion}</td>
              <td>{sol.fecha}</td>
              <td>{sol.estatus}</td>
              <td>
                <ul className="mb-0">
                  {recursosMostrados.map((r, i) => (
                    <li key={i}>{r.categoria} - {r.recurso} ({r.cantidad})</li>
                  ))}
                </ul>
                {sol.recursos.length > 2 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-primary"
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => toggleExpand(idx)}
                  >
                    {isExpanded ? 'Ver menos' : 'Ver más'}
                  </Button>
                )}
              </td>
              <td>
                <Button 
                  size="sm" 
                  variant="outline-danger" 
                  onClick={() => exportarPDF(sol)}
                >
                  <BsFileEarmarkPdf /> PDF
                </Button>{' '}
                <Button 
                  size="sm" 
                  variant="outline-info" 
                  onClick={() => {
                    const encoded = encodeURIComponent(JSON.stringify(sol));
                    window.open(`/ver-solicitud.html?data=${encoded}`, '_blank');
                  }}
                >
                  <BsEye />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TablaSolicitudes;