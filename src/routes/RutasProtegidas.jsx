// src/routes/RutasProtegidas.jsx
import RutaProtegida from "./RutaProtegida";
import Layout from "../components/Layout";
import { Route } from "react-router-dom";
// Contenedores protegidos
import Dashboard from "../containers/Dashboard";
import Personal from "../containers/Personal";
import Flota from "../containers/Flota";
import Actividad from "../containers/Actividad";
import Porteria from "../containers/Porteria";
import Mecanicos from "../containers/sub-containers/Mecanicos";
import ChoferesLarga from "../containers/sub-containers/ChoferesLarga";
import ChoferesMovimiento from "../containers/sub-containers/ChoferesMovimiento";
import Tractores from "../containers/sub-containers/Tractores";
import Furgones from "../containers/sub-containers/Furgones";
// Contenedores en edicion
import TallerTractores from "../containers/TallerTractores";
import Utilitarios from "../containers/sub-containers/Utilitarios";
import ControlCombustible from "../containers/ControlCombustilbe";

export const rutasProtegidas = (
  <>
    <Route
      path="/"
      element={
        <RutaProtegida rolRequerido="user">
          <Layout>
            <Dashboard />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/personal"
      element={
        <RutaProtegida rolRequerido="admin">
          <Layout>
            <Personal />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/mecanicos"
      element={
        <RutaProtegida rolRequerido="admin">
          <Layout>
            <Mecanicos />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/choferes-larga"
      element={
        <RutaProtegida rolRequerido="admin">
          <Layout>
            <ChoferesLarga />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/choferes-movimiento"
      element={
        <RutaProtegida rolRequerido="admin">
          <Layout>
            <ChoferesMovimiento />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/flota"
      element={
        <RutaProtegida rolRequerido="admin">
          <Layout>
            <Flota />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/tractores"
      element={
        <RutaProtegida rolRequerido="admin">
          <Layout>
            <Tractores />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/furgones"
      element={
        <RutaProtegida rolRequerido="admin">
          <Layout>
            <Furgones />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/utilitarios"
      element={
        <RutaProtegida rolRequerido="admin">
          <Layout>
            <Utilitarios />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/actividad"
      element={
        <RutaProtegida rolRequerido="user">
          <Layout>
            <Actividad />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/porteria"
      element={
        <RutaProtegida rolRequerido="user">
          <Layout>
            <Porteria />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/taller-tractores"
      element={
        <RutaProtegida rolRequerido="dev">
          <Layout>
            <TallerTractores />
          </Layout>
        </RutaProtegida>
      }
    />
    <Route
      path="/control-combustible"
      element={
        <RutaProtegida rolRequerido="dev">
          <Layout>
            <ControlCombustible />
          </Layout>
        </RutaProtegida>
      }
    />
      </>
);
