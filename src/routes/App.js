import '../assets/css/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Denied from './Denied.jsx';
import Page404 from './404.jsx';
import { rutasProtegidas } from './access/RutasProtegidas.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />
          <Route path='/no-autorizado' element={<Denied />} />
          <Route path='/404' element={<Page404 />} />
          {/* Rutas protegidas */}
          {rutasProtegidas}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
