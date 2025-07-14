import '../assets/css/App.css';
import Dashboard from '../containers/Dashboard.jsx';
import Personal from '../containers/Personal.jsx';
import Mecanicos from '../containers/tables/Mecanicos.jsx';
import ChoferesLarga from '../containers/tables/ChoferesLarga.jsx';
import ChoferesMovimiento from '../containers/tables/ChoferesMovimiento.jsx';
import Flota from '../containers/Flota.jsx';
import Layout from '../components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/personal' element={<Personal />} />
            <Route path='/mecanicos' element={<Mecanicos />} />
            <Route path='/choferes-larga' element={<ChoferesLarga />} />
            <Route path='/choferes-movimiento' element={<ChoferesMovimiento />} />
            <Route path='/flota' element={<Flota />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
