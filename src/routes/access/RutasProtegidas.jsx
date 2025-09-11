import RutaProtegida from "./RutaProtegida";
import Layout from "../../components/Layout";
import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load de contenedores
const Dashboard = lazy(() => import("../../containers/Dashboard"));
const Settings = lazy(() => import("../../containers/Settings"));
const Resources = lazy(() => import("../../containers/Resources"));
const Personal = lazy(() => import("../../containers/Personal"));
const Flota = lazy(() => import("../../containers/Flota"));
const Actividad = lazy(() => import("../../containers/Actividad"));
const Porteria = lazy(() => import("../../containers/Porteria"));
const Mecanicos = lazy(() =>
  import("../../containers/sub-containers/Mecanicos")
);
const ChoferesLarga = lazy(() =>
  import("../../containers/sub-containers/ChoferesLarga")
);
const ChoferesMovimiento = lazy(() =>
  import("../../containers/sub-containers/ChoferesMovimiento")
);
const Administrativos = lazy(() =>
  import("../../containers/sub-containers/Administrativos")
);
const Tractores = lazy(() =>
  import("../../containers/sub-containers/Tractores")
);
const Furgones = lazy(() => import("../../containers/sub-containers/Furgones"));
const TallerTractores = lazy(() => import("../../containers/TallerTractores"));
const Utilitarios = lazy(() =>
  import("../../containers/sub-containers/Utilitarios")
);
const ControlCombustible = lazy(() =>
  import("../../containers/ControlCombustilbe")
);
const Vigilantes = lazy(() =>
  import("../../containers/sub-containers/Vigilantes")
);
const Fleteros = lazy(() => import("../../containers/sub-containers/Fleteros"));
const Stock = lazy(() => import("../../containers/Stock"));
const Satelital = lazy(() => import("../../containers/Satelital"));
const TallerFurgones = lazy(() => import("../../containers/TallerFurgones"));

// Wrapper de Suspense para no repetir
const withSuspense = (Component) => (
  <Suspense fallback={<div className="loading">Cargando...</div>}>
    <Component />
  </Suspense>
);

export const rutasProtegidas = (
  <Route
    element={
      <RutaProtegida>
        <Layout />
      </RutaProtegida>
    }
  >
    <Route path="/" element={withSuspense(Dashboard)} />
    <Route path="/perfil" element={withSuspense(Settings)} />
    <Route path="/recursos" element={withSuspense(Resources)} />
    <Route path="/personal" element={withSuspense(Personal)} />
    <Route path="/mecanicos" element={withSuspense(Mecanicos)} />
    <Route path="/choferes-larga" element={withSuspense(ChoferesLarga)} />
    <Route
      path="/choferes-movimiento"
      element={withSuspense(ChoferesMovimiento)}
    />
    <Route path="/administrativos" element={withSuspense(Administrativos)} />
    <Route path="/flota" element={withSuspense(Flota)} />
    <Route path="/tractores" element={withSuspense(Tractores)} />
    <Route path="/furgones" element={withSuspense(Furgones)} />
    <Route path="/utilitarios" element={withSuspense(Utilitarios)} />
    <Route path="/seguridad" element={withSuspense(Vigilantes)} />
    <Route path="/fleteros" element={withSuspense(Fleteros)} />
    <Route path="/stock" element={withSuspense(Stock)} />
    <Route path="/actividad" element={withSuspense(Actividad)} />
    <Route path="/satelital" element={withSuspense(Satelital)} />
    <Route path="/porteria" element={withSuspense(Porteria)} />
    <Route path="/taller-tractores" element={withSuspense(TallerTractores)} />
    <Route path="/taller-furgones" element={withSuspense(TallerFurgones)} />
    <Route
      path="/control-combustible"
      element={withSuspense(ControlCombustible)}
    />
  </Route>
);
