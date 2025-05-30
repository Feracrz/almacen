import React, { useState } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const dataLine = [
  { name: 'Ene', value: 1900 },
  { name: 'Feb', value: 2000 },
  { name: 'Mar', value: 2150 },
  { name: 'Abr', value: 2220 },
  { name: 'May', value: 2300 },
  { name: 'Jun', value: 2350 },
  { name: 'Jul', value: 2370 },
  { name: 'Ago', value: 2450 },
  { name: 'Sep', value: 2580 },
  { name: 'Oct', value: 2700 },
  { name: 'Nov', value: 2850 },
  { name: 'Dic', value: 3000 },
];

const pieData = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 300 },
  { name: 'D', value: 200 },
];

const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545'];

const Dashboard = () => {
  const [filtro, setFiltro] = useState('Año');

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold text-primary mb-4">Panel de Control</h3>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <Card className="shadow border-0 rounded-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-semibold mb-0">Tendencia de Inventario</h5>
                <ButtonGroup>
                  {['Semana', 'Mes', 'Año'].map(periodo => (
                    <Button
                      key={periodo}
                      variant={filtro === periodo ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFiltro(periodo)}
                    >
                      {periodo}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataLine}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0d6efd" fill="#dbeafe" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card className="mb-3 shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="text-muted small">Total de Productos</div>
              <h2 className="fw-bold text-dark">2,384</h2>
              <div className="text-success small fw-semibold">▲ 4.3% este mes</div>
            </Card.Body>
          </Card>

          <Card className="mb-3 shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="text-muted small">En Stock</div>
              <h2 className="fw-bold text-dark">1,876</h2>
              <div className="text-success small fw-semibold">▲ 2.7% este mes</div>
            </Card.Body>
          </Card>

          <Card className="mb-3 shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="text-muted small">Productos Agotados</div>
              <h2 className="fw-bold text-dark">87</h2>
              <div className="text-danger small fw-semibold">▼ 1.5% este mes</div>
            </Card.Body>
          </Card>

          <Card className="mb-3 shadow-sm border-0 rounded-4">
            <Card.Body>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={35}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
