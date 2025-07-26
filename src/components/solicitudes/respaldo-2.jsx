import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { BsDownload, BsEye } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportarPDF = (solicitud) => {
  const doc = new jsPDF();
  doc.text("Solicitud de Recursos", 14, 10);
  doc.text(`Descripción: ${solicitud.descripcion}`, 14, 20);
  doc.text(`Fecha: ${solicitud.fecha}`, 14, 30);
  doc.autoTable({
    head: [['Categoría', 'Recurso', 'Cantidad']],
    body: solicitud.recursos.map(r => [r.categoria, r.recurso, r.cantidad])
  });
  doc.save(`Solicitud_${solicitud.fecha}.pdf`);
};

const TablaSolicitudes = ({ solicitudes }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleExpand = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter(i => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
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
                    className="p-0"
                    onClick={() => toggleExpand(idx)}
                  >
                    {isExpanded ? 'Ver menos' : 'Ver más'}
                  </Button>
                )}
              </td>
              <td>
                <Button size="sm" variant="outline-danger" onClick={() => exportarPDF(sol)}><BsDownload /></Button>{' '}
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


con html 



import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { BsDownload, BsEye } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportarPDF = (solicitud) => {
  const doc = new jsPDF();
  doc.text("Solicitud de Recursos", 14, 10);
  doc.text(`Descripción: ${solicitud.descripcion}`, 14, 20);
  doc.text(`Fecha: ${solicitud.fecha}`, 14, 30);
  doc.autoTable({
    head: [['Categoría', 'Recurso', 'Cantidad']],
    body: solicitud.recursos.map(r => [r.categoria, r.recurso, r.cantidad])
  });
  doc.save(`Solicitud_${solicitud.fecha}.pdf`);
};

const exportarHTML = (solicitud) => {
  // Contenido HTML dinámico
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Solicitud ${solicitud.fecha}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { color: #2e659e; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        table, th, td { border: 1px solid #ccc; }
        th, td { padding: 8px; text-align: left; }
      </style>
    </head>
    <body>
      <h2>Solicitud de Recursos</h2>
      <p><strong>Descripción:</strong> ${solicitud.descripcion}</p>
      <p><strong>Fecha:</strong> ${solicitud.fecha}</p>
      <p><strong>Estatus:</strong> ${solicitud.estatus}</p>
      <h3>Recursos:</h3>
      <table>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Recurso</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          ${solicitud.recursos.map(r => `
            <tr>
              <td>${r.categoria}</td>
              <td>${r.recurso}</td>
              <td>${r.cantidad}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Crear Blob y forzar descarga
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Solicitud_${solicitud.fecha}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
                <Button size="sm" variant="outline-danger" onClick={() => exportarPDF(sol)}><BsDownload /></Button>{' '}
                <Button 
                  size="sm" 
                  variant="outline-success"
                  onClick={() => exportarHTML(sol)}
                >
                  HTML
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








sin  html



import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { BsDownload, BsEye, BsFileEarmarkPdf } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportarPDF = (solicitud) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text("Solicitud de Recursos", 14, 20);

  // Datos generales
  doc.setFontSize(12);
  doc.text(`Descripción: ${solicitud.descripcion}`, 14, 35);
  doc.text(`Fecha: ${solicitud.fecha}`, 14, 45);
  doc.text(`Estatus: ${solicitud.estatus}`, 14, 55);

  // Tabla de recursos
  doc.autoTable({
    startY: 70,
    head: [['Categoría', 'Recurso', 'Cantidad']],
    body: solicitud.recursos.map(r => [r.categoria, r.recurso, r.cantidad]),
    theme: 'grid',
    headStyles: { fillColor: [46, 101, 158], textColor: 255 },
    styles: { fontSize: 11 }
  });

  // Guardar PDF
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
                <Button size="sm" variant="outline-danger" onClick={() => exportarPDF(sol)}>
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