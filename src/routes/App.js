import '../assets/css/App.css';
import Dashboard from '../containers/Dashboard.jsx';
import Personal from '../containers/Personal.jsx';
import Mecanicos from '../containers/Mecanicos.jsx';
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
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
