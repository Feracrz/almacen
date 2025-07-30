{/*import React from 'react';
import { Table, Button } from 'react-bootstrap';

const TablaSolicitudes = ({ solicitudes, onVerAsignar, onCancelar }) => (
  <Table bordered hover>
    <thead className="text-center">
      <tr>
        <th># Solicitud</th>
        <th>Solicitante</th>
        <th>Área</th>
        <th>Fecha Solicitud</th>
        <th>Autorizó</th>
        <th>Estatus</th>
        
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody className="text-center">
      {solicitudes.map(s => (
        <tr key={s.id}>
          <td>{s.id}</td>
          <td>{s.solicitante}</td>
          <td>{s.area}</td>  
          <td>{s.fecha}</td>
          <td>Ana Sofia Cano</td>
          <td>{s.estatus}</td>
          
          <td>
            <Button size="sm" variant="outline-info" disabled={s.estatus === 'Cancelada'} onClick={() => onVerAsignar(s)}>Ver/Asignar</Button>{' '}
            
            <Button size="sm" variant="outline-danger" disabled={s.estatus === 'Cancelada'} onClick={() => onCancelar(s)}>Cancelar</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default TablaSolicitudes;*/   }