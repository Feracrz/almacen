import React from 'react';
import { Table, Button } from 'react-bootstrap';

const TablaSolicitudes = ({ solicitudes, onVerAsignar, onCambiarEstatus, onCancelar }) => (
  <Table bordered hover>
    <thead className="text-center">
      <tr>
        <th># Solicitud</th>
        <th>Área</th>
        <th>Solicitante</th>
        <th>Fecha Solicitud</th>
        <th>Estatus</th>
        <th>Autorizó</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody className="text-center">
      {solicitudes.map(s => (
        <tr key={s.id}>
          <td>{s.id}</td>
          <td>{s.area}</td>
          <td>{s.solicitante}</td>
          <td>{s.fecha}</td>
          <td>{s.estatus}</td>
          <td>Ana Sofia Cano</td>
          <td>
            <Button size="sm" variant="outline-info" disabled={s.estatus === 'Cancelada'} onClick={() => onVerAsignar(s)}>Ver/Asignar</Button>{' '}
            <Button size="sm" variant="outline-warning" disabled={s.estatus === 'Cancelada'} onClick={() => onCambiarEstatus(s)}>Estatus</Button>{' '}
            <Button size="sm" variant="outline-danger" disabled={s.estatus === 'Cancelada'} onClick={() => onCancelar(s)}>Cancelar</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default TablaSolicitudes;