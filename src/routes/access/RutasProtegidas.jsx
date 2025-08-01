import RutaProtegida from "./RutaProtegida";
import Layout from "../../components/Layout";
import { Route } from "react-router-dom";

// Contenedores protegidos
import Dashboard from "../../containers/Dashboard";
import Personal from "../../containers/Personal";
import Flota from "../../containers/Flota";
import Actividad from "../../containers/Actividad";
import Porteria from "../../containers/Porteria";
import Mecanicos from "../../containers/sub-containers/Mecanicos";
import ChoferesLarga from "../../containers/sub-containers/ChoferesLarga";
import ChoferesMovimiento from "../../containers/sub-containers/ChoferesMovimiento";
import Tractores from "../../containers/sub-containers/Tractores";
import Furgones from "../../containers/sub-containers/Furgones";
import TallerTractores from "../../containers/TallerTractores";
import Utilitarios from "../../containers/sub-containers/Utilitarios";
import ControlCombustible from "../../containers/ControlCombustilbe";
import Stock from "../../containers/Stock";

export const rutasProtegidas = (
  <>
    <Route
      path="/"
      element={
        <RutaProtegida>
          <Layout>
            <Dashboard />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route path="/personal" element={<RutaProtegida><Layout><Personal /></Layout></RutaProtegida>} />
    <Route path="/mecanicos" element={<RutaProtegida><Layout><Mecanicos /></Layout></RutaProtegida>} />
    <Route path="/choferes-larga" element={<RutaProtegida><Layout><ChoferesLarga /></Layout></RutaProtegida>} />
    <Route path="/choferes-movimiento" element={<RutaProtegida><Layout><ChoferesMovimiento /></Layout></RutaProtegida>} />
    <Route path="/flota" element={<RutaProtegida><Layout><Flota /></Layout></RutaProtegida>} />
    <Route path="/tractores" element={<RutaProtegida><Layout><Tractores /></Layout></RutaProtegida>} />
    <Route path="/furgones" element={<RutaProtegida><Layout><Furgones /></Layout></RutaProtegida>} />
    <Route path="/utilitarios" element={<RutaProtegida><Layout><Utilitarios /></Layout></RutaProtegida>} />
    <Route path="/actividad" element={<RutaProtegida><Layout><Actividad /></Layout></RutaProtegida>} />
    <Route path="/porteria" element={<RutaProtegida><Layout><Porteria /></Layout></RutaProtegida>} />
    <Route path="/taller-tractores" element={<RutaProtegida><Layout><TallerTractores /></Layout></RutaProtegida>} />
    <Route path="/control-combustible" element={<RutaProtegida><Layout><ControlCombustible /></Layout></RutaProtegida>} />
    <Route path="/stock" element={<RutaProtegida><Layout><Stock /></Layout></RutaProtegida>} />
  </>
);
