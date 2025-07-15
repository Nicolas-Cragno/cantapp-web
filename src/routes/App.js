import '../assets/css/App.css';
import Layout from '../components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// pag principales
import Dashboard from '../containers/Dashboard.jsx';
import Personal from '../containers/Personal.jsx';
import Flota from '../containers/Flota.jsx';
import Porteria from '../containers/Porteria.jsx';
// pag secundarias
import Mecanicos from '../containers/sub-containers/Mecanicos.jsx';
import ChoferesLarga from '../containers/sub-containers/ChoferesLarga.jsx';
import ChoferesMovimiento from '../containers/sub-containers/ChoferesMovimiento.jsx';
import Tractores from '../containers/sub-containers/Tractores.jsx';
import Furgones from '../containers/sub-containers/Furgones.jsx';
import Utilitarios from '../containers/sub-containers/Utilitarios.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            {/* PERSONAL */}
            <Route path='/personal' element={<Personal />} />
            <Route path='/mecanicos' element={<Mecanicos />} />
            <Route path='/choferes-larga' element={<ChoferesLarga />} />
            <Route path='/choferes-movimiento' element={<ChoferesMovimiento />} />
            {/* FLOTA */}
            <Route path='/flota' element={<Flota />} />
            <Route path='/tractores' element={<Tractores />} />
            <Route path='/furgones' element={<Furgones />} />
            <Route path='/utilitarios' element={<Utilitarios />} />
            {/* PORTERIA */}
            <Route path='/porteria' element={<Porteria />} />
            {/* TALLER */}
            {/* CONTROL COMBUSTIBLE */}
            {/*  */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
