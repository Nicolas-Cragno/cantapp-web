import unidades from "./data/unidades.json";
import { useData } from "../context/DataContext";

// ----------------------------------------------------------------------- Nombre de empresas
export const useNombreEmpresa = (cuit) => {
  const { empresas } = useData();
  const nombreError = "SIN ASIGNAR";

  if (!cuit) return nombreError;

  const empresa = empresas.find((e) => e.id === cuit || e.cuit === cuit);
  return empresa ? empresa.nombre : nombreError;
}

export const useObtenerCuitPorNombre = (nombreEmpresa) => {
  const {empresas} = useData();
  const valorError = 0;

  if(!nombreEmpresa || typeof nombreEmpresa !== "string") return valorError;

  const empresa = empresas.find((e) => e.nombre === nombreEmpresa);
  return empresa ? empresa.cuit : valorError;
}

// ----------------------------------------------------------------------- Personas

export const useBuscarDni = (nombrePersona) => {
  const {personas} = useData();
  const valorError = 0;

  if(!nombrePersona || typeof nombrePersona !== "string") return valorError;

  const persona = personas.find((p) => p.apellido + ", " + p.nombres === nombrePersona || p.apellido + ", " + p.nombres[0] + "." === nombrePersona);
  return persona ? persona.dni : valorError;
}

export const useBuscarPersona = (dni, completo=true) => {
  const {personas} = useData();
  const valorError = "";

  if(!dni) return valorError;

  const persona = personas.find((p) => p.dni === dni || p.id === dni);
  if(!persona) return valorError;
  const nombreCompleto = `${persona.apellido}, ${persona.nombres}`;
  const nombreAbreviado = `${persona.apellido}, ${persona.nombres[0]}`;

  return completo ? nombreCompleto : nombreAbreviado;
}

export const buscarPersona = (coleccion, dni, completo=true) => {
  if (!dni) return "";
  const persona = coleccion.find((p) => p.dni === dni || p.id === dni);
  if (!persona) return "";
  const nombreCompleto = `${persona.apellido}, ${persona.nombres}`;
  const nombreAbreviado = `${persona.apellido}, ${persona.nombres[0]}.`;
  return completo ? nombreCompleto : nombreAbreviado;
}

// ----------------------------------------------------------------------- Vehiculos

export const useBuscarDominio = (interno, tipo = "tractor") => {
  const {tractores, furgones} = useData();
  const valorError = "";
  let vehiculo = null;

  if(!interno) return valorError;

  if(tipo==="tractor"){
   vehiculo = tractores.find((t) => t.interno === interno || t.id === interno); 
  } else{
    vehiculo = furgones.find((f) => f.interno === interno || f.id === interno);
  }

  return vehiculo ? vehiculo.dominio : valorError;
}

export const buscarDominio = (interno, coleccion = []) => {


  if (!interno) return "";
  let vehiculo = null;

  vehiculo = coleccion.find((v) => v.interno === interno || v.id === interno);

  return vehiculo ? vehiculo.dominio : "";
};

// ----------------------------------------------------------------------- Formato fecha

export const formatearFecha = (fechaInput) => {
  if (!fechaInput) return "";

  if (fechaInput.seconds !== undefined && fechaInput.nanoseconds !== undefined) {
    fechaInput = new Date(fechaInput.seconds * 1000 + fechaInput.nanoseconds / 1000000);
  } else if (typeof fechaInput.toDate === "function") {
    fechaInput = fechaInput.toDate();
  } else {
    fechaInput = new Date(fechaInput);
  }

  if (isNaN(fechaInput.getTime())) return "";

  const dia = String(fechaInput.getDate()).padStart(2, "0");
  const mes = String(fechaInput.getMonth() + 1).padStart(2, "0");
  const anio = fechaInput.getFullYear();

  return `${dia}/${mes}/${anio}`;
};

export const formatearFechaCorta = (fechaInput) => {
  if (!fechaInput) return "";

  if (fechaInput.seconds !== undefined && fechaInput.nanoseconds !== undefined) {
    fechaInput = new Date(fechaInput.seconds * 1000 + fechaInput.nanoseconds / 1000000);
  } else if (typeof fechaInput.toDate === "function") {
    fechaInput = fechaInput.toDate();
  } else {
    fechaInput = new Date(fechaInput);
  }

  if (isNaN(fechaInput.getTime())) return "";

  const dia = String(fechaInput.getDate()).padStart(2, "0");
  const mes = String(fechaInput.getMonth() + 1).padStart(2, "0");

  return `${dia}-${mes}`;
};

export const formatearHora = (fechaInput) => {
  if (!fechaInput) return "";

  if (fechaInput.seconds !== undefined && fechaInput.nanoseconds !== undefined) {
    fechaInput = new Date(fechaInput.seconds * 1000 + fechaInput.nanoseconds / 1000000);
  } else if (typeof fechaInput.toDate === "function") {
    fechaInput = fechaInput.toDate();
  } else {
    fechaInput = new Date(fechaInput);
  }

  if (isNaN(fechaInput.getTime())) return "";

  const horas = String(fechaInput.getHours()).padStart(2, "0");
  const minutos = String(fechaInput.getMinutes()).padStart(2, "0");

  return `${horas}:${minutos}`;
};

export const formatearFechaInput = (fecha) => {
  if (!fecha) return "";

  const f = new Date(fecha);

  if (isNaN(f.getTime())) return ""; 

  return f.toISOString().split("T")[0]; // yyyy-mm-dd
};

export const formatearFechaHoraInput = (fecha) => {
  if (!fecha) return "";
  const d = new Date(fecha);
  const pad = (n) => (n < 10 ? "0" + n : n);
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

// ----------------------------------------------------------------------- valores / unidades

export const obtenerNombreUnidad = (abreviatura) => {
  return Object.entries(unidades).find(([, abrev]) => abrev === abreviatura)?.[0] || "";
};

export const singularTipoVehiculo = (tipo) => {
  let tipoSingular;
  switch(tipo.toUpperCase()){
    case "TRACTORES":
      tipoSingular = "Tractor";
      break;
    case "FURGONES":
      tipoSingular = "Furgon";
      break;
      case "UTILITARIOS":
        tipoSingular = "Utilitario";
        break;
    default:
      tipoSingular = "Vehiculo";
      break;
  }
  return tipoSingular;
  
};

// ----------------------------------------------------------------------- colores & estilos

export const colorSatelital = (satelital) => {
    let color;
    switch (satelital) {
      case "SCANIA":
        color = "#1014c5";
        break;
      case "MICHELIN":
        color = "#efb810";
        break;
      default:
        color = "#000";
        break;
    }

    return color;
  };

export const colorBatman = (nro) => {
    if (nro >= 90) return "#cb3234";
    if (nro >= 30) return "#efb810";
    if (nro >= 0) return "#008f39";
    return "#000";
  };

export const colorPromedio = (nro) => {
  // Promedio +/- ideal 36 p/abajo
  const minimo = 20;
  const promedioIdeal = 36;
  const margen = promedioIdeal + 3;
  if (nro <= promedioIdeal && nro >= minimo) return "#008f39";
  if (nro > promedioIdeal && nro <= margen) return "#efb810";
  if (nro > margen) return "#cb3234";
  return "#000";
  
}