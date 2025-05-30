import React, { useState } from 'react';
import '../App.css';

const Navbar = ({ onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    { icon: "bi-house-fill", label: "Panel" },
    { icon: "bi-boxes", label: "Registro de Compra" },
    { icon: "bi-box", label: "Almacen" },
    { icon: "bi-truck", label: "Proveedores" },
    { icon: "bi-bar-chart-line", label: "Informes" },
    { icon: "bi-truck-flatbed", label: "Solicitudes" },
    { icon: "bi-gear", label: "Administración" },
    { icon: "bi-people", label: "Usuarios" },
  ];

  return (
    <div className={`d-flex flex-column bg-white border-end sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Encabezado */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        {!collapsed && <h5 className= " text-dark-blue m-0  fw-bold">CDHEH</h5>}
        <button onClick={toggleSidebar} className="btn btn-sm">
          <i className="bi bi-list fs-4"></i>
        </button>
      </div>

      {/* Menú */}
      <nav className="flex-grow-1 p-2">
        <ul className="nav flex-column">
          {menuItems.map((item, idx) => (
            <li key={idx} className="nav-item">
              <button
                onClick={() => onSelect(item.label)}
                className="nav-link d-flex align-items-center sidebar-link btn btn-link text-start w-100"
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {!collapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Usuario */}
      <div className="p-3 border-top d-flex align-items-center">
        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
          AM
        </div>
        {!collapsed && (
          <div className="ms-2">
            <div className="fw-bold">Admin</div>
            <div className="text-muted" style={{ fontSize: 12 }}>Administrador</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;