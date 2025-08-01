import React, { useState } from 'react';
import Navbar from './components/Navbar'; // Asegúrate de que Navbar es el Sidebar

import Panel from './components/panelControl/panel';
import Registro from './components/registroCompra/Registro';
import Solicitudes from './components/solicitudes/agregrarSolicitudes';
import Respuesta from './components/respuestas/respuestaSolicitudes';
import Notificaciones from './components/notificaciones/notificaciones';
import Usuarios from './components/Usuarios/usuarios';

import Login from './components/login/login';

const App = () => {
  const [seccionActiva, setSeccionActiva] = useState("Panel");

  const renderContenido = () => {
    switch (seccionActiva) {
      case "Panel":
        return <div className="p-4">
        <Panel/>
        </div>;

case "Notificaciones":
  return (
    <div className="p-4">
      <h1>Esta es la vista de notificaciones</h1>
      <Notificaciones/>
      </div>
      ); 
      case "Almacen e Inventario":
        return (
          <div className="p-4">
            <h2>Almacen e Inventario</h2>
            <Registro />
          </div>
        );

      case "Solicitudes":
        return (
          <div className="p-4">
            <h1>Solicitud de Recursos</h1>
            <Solicitudes/>
            </div>
            ); 
      
      case "Validacion de Solicitudes":
        return (
          <div className='p-4'>
            <h1>Seguimiento de Solicitudes</h1>
            <Respuesta />
          </div>
        );


case "Usuarios":
        return (
          <div className='p-4'>
          <h2 className="p-4">Administración de usuarios</h2>;
            <Usuarios />
          </div>
        );

   

      case "Login":
             return (
          <div className='p-4'>
          <h2 className="p-4">Este es el login</h2>;
            <Login />
          </div>
        );

   


      case "Movimientos":
        return <h2 className="p-4">Historial de movimientos</h2>;


   

      case "Configuración":
        return <h2 className="p-4">Configuración del sistema</h2>;


      
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