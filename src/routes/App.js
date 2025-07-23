import '../assets/css/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import { rutasProtegidas } from './RutasProtegidas.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          {rutasProtegidas}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
