import RutaProtegida from "./RutaProtegida";
import Layout from "../../components/Layout";
import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load de contenedores
const Dashboard = lazy(() => import("../../containers/Dashboard"));
const Resources = lazy(() => import("../../containers/Resources"));
const Porteria = lazy(() => import("../../containers/Porteria"));
const Stock = lazy(() => import("../../containers/Stock"));
const Satelital = lazy(() => import("../../containers/Satelital"));

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

    <Route path="/satelital" element={withSuspense(Satelital)} />
    <Route path="/porteria" element={withSuspense(Porteria)} />
  </Route>
);
