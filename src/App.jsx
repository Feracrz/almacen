import React, { useState } from 'react';
import Navbar from './components/Navbar'; // Asegúrate de que Navbar es el Sidebar
import Inventario from './components/inventario/inventario';
import Panel from './components/panelControl/panel';
import Registro from './components/registroCompra/Registro';

const App = () => {
  const [seccionActiva, setSeccionActiva] = useState("Panel");

  const renderContenido = () => {
    switch (seccionActiva) {
      case "Panel":
        return <div className="p-4">
        <Panel/>
        </div>;
      case "Registro de Compra":
        return (
          <div className="p-4">
            <h2>Inventario</h2>
            <Registro />
          </div>
        );
      case "Productos":
        return <h2 className="p-4">Listado de productos</h2>;
      case "Proveedores":
        return <h2 className="p-4">Gestión de proveedores</h2>;
      case "Informes":
        return <h2 className="p-4">Informes y reportes</h2>;
      case "Movimientos":
        return <h2 className="p-4">Historial de movimientos</h2>;
      case "Usuarios":
        return <h2 className="p-4">Administración de usuarios</h2>;
      case "Configuración":
        return <h2 className="p-4">Configuración del sistema</h2>;
      default:
        return <h2 className="p-4">Selecciona una opción</h2>;
    }
  };

  return (
    <div className="d-flex">
      <Navbar onSelect={setSeccionActiva} />
      <div className="flex-grow-1 bg-light">{renderContenido()}</div>
    </div>
  );
};

export default App;