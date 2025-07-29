import React, { useState } from 'react';
import { Modal, Table, Button, Form } from 'react-bootstrap';

const ModalAsignacion = ({ show, onHide, solicitud, recursosPorCategoria, setSolicitudes, setHistorial }) => {
  const categorias = Object.keys(recursosPorCategoria);
  const [cantidadesAsignar, setCantidadesAsignar] = useState({});
  const [nuevosRecursos, setNuevosRecursos] = useState([]);

  const handleAgregarRecurso = () => 
    setNuevosRecursos([...nuevosRecursos, { categoria: "", recurso: "", stock: 0, cantidad: 0 }]);

  const handleEliminarRecurso = (index) => 
    setNuevosRecursos(nuevosRecursos.filter((_, i) => i !== index));

  const handleChangeRecurso = (index, field, value) => {
    const updated = [...nuevosRecursos];
    if (field === "cantidad") {
      const cantidad = Number(value);
      if (cantidad < 0) return;
      if (cantidad > updated[index].stock) return;
      updated[index].cantidad = cantidad;
    } else {
      updated[index][field] = value;
      if (field === "categoria") {
        updated[index].recurso = "";
        updated[index].stock = 0;
      }
      if (field === "recurso") {
        updated[index].stock = 10;
      }
    }
    setNuevosRecursos(updated);
  };

  const validarNuevosRecursos = () => {
    for (let r of nuevosRecursos) {
      if (!r.categoria.trim() || !r.recurso.trim() || r.cantidad <= 0) {
        alert("Todos los recursos nuevos deben tener categoría, recurso y cantidad válida.");
        return false;
      }
    }
    return true;
  };

  const handleGuardarAsignacion = () => {
    if (!validarNuevosRecursos()) return;
    const fechaAccion = new Date().toISOString().slice(0, 10);
    setSolicitudes(prev =>
      prev.map(s => {
        if (s.id === solicitud.id) {
          const nuevosRecursosAsignados = nuevosRecursos.map(r => ({
            nombre: r.recurso,
            stock: r.stock - r.cantidad,
            cantidadSolicitada: r.cantidad
          }));
          const recursosActualizados = [...s.recursos, ...nuevosRecursosAsignados];
          const estatus = Object.values(cantidadesAsignar).some(c => c > 0) || nuevosRecursos.length > 0 ? "Asignada" : s.estatus;
          return { ...s, recursos: recursosActualizados, estatus };
        }
        return s;
      })
    );
    setHistorial(prev => [...prev, {
      id: solicitud.id,
      solicitante: solicitud.solicitante,
      area: solicitud.area,
      fecha: fechaAccion,
      accion: "Asignación de recursos"
    }]);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton><Modal.Title>Detalle de Solicitud</Modal.Title></Modal.Header>
      <Modal.Body>
        <p><strong>Área:</strong> {solicitud.area}</p>
        <p><strong>Solicitante:</strong> {solicitud.solicitante}</p>
        <p><strong>Fecha de Solicitud:</strong> {solicitud.fecha}</p>
        <h5>Recursos Solicitados</h5>
        <Table bordered>
          <thead><tr><th>Recurso</th><th>Solicitado</th><th>Stock</th><th>Cantidad a Asignar</th></tr></thead>
          <tbody>
            {solicitud.recursos.map((r, idx) => (
              <tr key={idx}>
                <td>{r.nombre}</td>
                <td>{r.cantidadSolicitada}</td>
                <td>{r.stock}</td>
                <td>
                  <Form.Control 
                    type="number" 
                    min={0} 
                    max={r.stock} 
                    value={cantidadesAsignar[idx] || 0} 
                    onChange={e => setCantidadesAsignar({ ...cantidadesAsignar, [idx]: Number(e.target.value) })} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <hr />
        
        <Button variant="outline-success" size="sm" onClick={handleAgregarRecurso}>Agregar</Button>
        {nuevosRecursos.length > 0 && (
          <div><h5>Recursos Nuevos </h5>
          <Table bordered className="mt-3">
            <thead><tr><th>Categoría</th><th>Recurso</th><th>Stock</th><th>Cantidad</th><th>Acciones</th></tr></thead>
            <tbody>
              {nuevosRecursos.map((r, idx) => (
                <tr key={idx}>
                  <td>
                    <Form.Select 
                      required
                      value={r.categoria} 
                      onChange={(e) => handleChangeRecurso(idx, "categoria", e.target.value)}
                    >
                      <option value="">Seleccione</option>
                      {categorias.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select 
                      required
                      value={r.recurso} 
                      disabled={!r.categoria} 
                      onChange={(e) => handleChangeRecurso(idx, "recurso", e.target.value)}
                    >
                      <option value="">Seleccione</option>
                      {r.categoria && recursosPorCategoria[r.categoria].map((re, i) => <option key={i} value={re}>{re}</option>)}
                    </Form.Select>
                  </td>
                  <td>{r.stock - r.cantidad}</td>
                  <td>
                    <Form.Control 
                      type="number" 
                      required 
                      min={1} 
                      value={r.cantidad} 
                      onChange={(e) => handleChangeRecurso(idx, "cantidad", e.target.value)} 
                    />
                  </td>
                  <td>
                    <Button variant="outline-danger" size="sm" onClick={() => handleEliminarRecurso(idx)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
        <Button variant="primary" onClick={handleGuardarAsignacion}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAsignacion;