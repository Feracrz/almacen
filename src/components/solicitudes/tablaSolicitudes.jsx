import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { BsFileEarmarkPdf, BsEye } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportarPDF = async (solicitud) => {
  const encoded = encodeURIComponent(JSON.stringify(solicitud));
  const url = `/ver-solicitud.html?data=${encoded}`;

  // ------> se abre el documento 
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const content = iframe.contentWindow.document.body;

    // ------> descarca del documento de la solicitud 
    await doc.html(content, {
      x: 10,
      y: 10,
      width: 190,
      windowWidth: 800,
      callback: function (doc) {
        doc.save(`Solicitud_${solicitud.fecha}.pdf`);
        document.body.removeChild(iframe); // Limpiamos
      }
    });
  };
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