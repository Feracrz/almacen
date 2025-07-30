import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { BsFileEarmarkPdf, BsEye, BsPencil } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

   const exportarPDF = async (solicitud) => {
    const encoded = encodeURIComponent(JSON.stringify(solicitud));
    const url = `/ver-solicitud.html?data=${encoded}`;

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const content = iframe.contentWindow.document.body;
    await doc.html(content, {
      x: 10,
      y: 10,
      width: 190,
      windowWidth: 800,
      callback: function (doc) {
        doc.save(`Solicitud_${solicitud.fecha}.pdf`);
        document.body.removeChild(iframe);
      }
    });
  };
};

const TablaSolicitudes = ({ solicitudes, onEditarRecursos }) => {
  const [showModalVer, setShowModalVer] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const handleVer = (sol) => {
    setSolicitudSeleccionada(sol);
    setShowModalVer(true);
  };

  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((sol, idx) => (
            <tr key={idx}>
              <td>{sol.fecha}</td>
              <td>{sol.estatus}</td>
              <td>
                {/* <Button 
                  size="sm" 
                  variant="outline-danger" 
                  onClick={() => exportarPDF(sol)}
                >
                  <BsFileEarmarkPdf />
                </Button>{' '}* */}
                <Button 
                  size="sm" 
                  variant="outline-info" 
                  onClick={() => handleVer(sol)}
                >
                  <BsEye />
                </Button>{' '}
               {sol.estatus !== "Cancelado" && sol.estatus !== "Aprobado" && (
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => onEditarRecursos(sol)}
                  >
                    <BsPencil /> 
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL VER SOLICITUD */}
      <Modal show={showModalVer} onHide={() => setShowModalVer(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Recursos solicitados</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {solicitudSeleccionada && (
            <>
              <p><strong>Solicitud:</strong> {solicitudSeleccionada.descripcion}</p>
              <p><strong>Fecha:</strong> {solicitudSeleccionada.fecha}</p>
              <p><strong>Estatus:</strong> {solicitudSeleccionada.estatus}</p>
              <br/>
              
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Recurso</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudSeleccionada.recursos.map((r, i) => (
                    <tr key={i}>
                      <td>{r.categoria}</td>
                      <td>{r.recurso}</td>
                      <td>{r.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalVer(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TablaSolicitudes;