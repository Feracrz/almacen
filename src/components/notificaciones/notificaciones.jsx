import React, { useEffect, useState } from "react";
import { Alert, ListGroup, Badge } from "react-bootstrap";

const Notificaciones = () => {
  // Datos de ejemplo (simulan recursos en el sistema)
  const [recursos, setRecursos] = useState([
    { id: 1, nombre: "Laptops", stock: 5, minimo: 10 },
    { id: 2, nombre: "Monitores", stock: 25, minimo: 20 },
    { id: 3, nombre: "Sillas", stock: 3, minimo: 5 },
    { id: 4, nombre: "Cuadernos", stock: 50, minimo: 30 },
  ]);

  const [alertas, setAlertas] = useState([]);

  // Al montar el componente, calculamos las notificaciones
  useEffect(() => {
    const bajasExistencias = recursos.filter((r) => r.stock <= r.minimo);
    setAlertas(bajasExistencias);
  }, [recursos]);

  return (
    <div className="container mt-4">
      <h2>Notificaciones de Stock</h2>
      {alertas.length > 0 ? (
        <Alert variant="warning">
          <strong>¡Atención!</strong> Algunos recursos están por debajo del stock mínimo.
        </Alert>
      ) : (
        <Alert variant="success">Todo el stock está en niveles seguros.</Alert>
      )}

      <ListGroup>
        {alertas.map((item) => (
          <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
            {item.nombre}
            <Badge bg="danger">Stock: {item.stock}</Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Notificaciones;