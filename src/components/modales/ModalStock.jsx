// ----------------------------------------------------------------------- imports externos
import { useState, useMemo } from "react";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { buscarPersona } from "../../functions/dataFunctions";
import TablaColeccion from "../tablas/TablaColeccion";
import LogoEmpresaTxt from "../logos/LogoEmpresaTxt";
import FichaPersonal from "../fichas/FichaPersonal";
import FormPersona from "../forms/FormPersona";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Modales.css";
import { BsPersonDash } from "react-icons/bs"; // logo innactiva
import { BsPersonCheck } from "react-icons/bs"; // logo activa
import { BsPersonPlusFill } from "react-icons/bs"; // logo agregar

const ModalStock = ({ coleccion, sucursal = "01", lugar = null }) => {
  const { ubicacion } = useData();

  const columnasVehiculo = [
    {
      titulo: "INTERNO",
      campo: "interno",
    },
    {
      titulo: "DOMINIO",
      campo: "dominio",
    },
  ];

  const filtro = useMemo(()=> {
    
  })
};

export default ModalStock;
