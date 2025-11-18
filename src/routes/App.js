// ----------------------------------------------------------------------- imports externos
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ----------------------------------------------------------------------- imports internos
import { rutasProtegidas } from './access/RutasProtegidas.jsx';
import { DataProvider } from '../context/DataContext.jsx';
import { useLogoutOnClose, useLogoutOnStart } from '../functions/userFunctions.js'; // p/cerrar sesion
import Login from './Login.jsx';
import Denied from './Denied.jsx';
import Page404 from './404.jsx';
import '../assets/css/App.css';

function App() {
  
  //useLogoutOnStart(); // cerrar sesión anterior si la hubiese
  //useLogoutOnClose(); // cerrar automáticamente al cerrar ventana
  
  return (
    <div className="App">
      <BrowserRouter>
        <DataProvider>
          <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />
          <Route path='/no-autorizado' element={<Denied />} />
          <Route path='/404' element={<Page404 />} />
          {/* Rutas protegidas */}
          {rutasProtegidas}
          <Route path="*" element={<Page404 />} />
        </Routes>
        </DataProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
