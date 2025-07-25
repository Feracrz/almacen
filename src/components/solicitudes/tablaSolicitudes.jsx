import React from 'react';
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
    startY: 40,
    head: [["Categoría", "Recurso", "Cantidad"]],
    body: solicitud.recursos.map(r => [r.categoria, r.recurso, r.cantidad])
  });
  doc.save("solicitud.pdf");
};

const TablaSolicitudes = ({ solicitudes }) => (
  <Table bordered hover className="text-center">
    <thead>
      <tr>
        <th>Descripción</th>
        <th>Fecha</th>
        <th>Estatus</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {solicitudes.map((sol, idx) => (
        <tr key={idx}>
          <td>{sol.descripcion}</td>
          <td>{sol.fecha}</td>
          <td>{sol.estatus}</td>
          <td>
            <Button size="sm" variant="outline-danger" onClick={() => exportarPDF(sol)}><BsDownload /></Button>{' '}
            <Button size="sm" variant="outline-info" href="/ver-solicitud.html" target="_blank"><BsEye /></Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default TablaSolicitudes;