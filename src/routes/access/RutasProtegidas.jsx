// ----------------------------------------------------------------------- imports externos
import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// ----------------------------------------------------------------------- internos
import RutaProtegida from "./RutaProtegida";
import Layout from "../../components/Layout";

// Lazy load de contenedores
const Dashboard = lazy(() => import("../../containers/Dashboard"));
const Resources = lazy(() => import("../../containers/Resources"));
const Porteria = lazy(() => import("../../containers/Porteria"));
const Stock = lazy(() => import("../../containers/Stock"));
const Combustible = lazy(() => import("../../containers/Combustible"));
const Tractores = lazy(() => import("../../containers/Tractores"));
const Furgones = lazy(() => import("../../containers/Furgones"));

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
    <Route path="/recursos" element={withSuspense(Resources)} />
    <Route path="/stock" element={withSuspense(Stock)} />
    <Route path="/porteria" element={withSuspense(Porteria)} />
    <Route path="/tractores" element={withSuspense(Tractores)} />
    <Route path="/furgones" element={withSuspense(Furgones)} />
    <Route path="/combustible" element={withSuspense(Combustible)} />
  </Route>
);
