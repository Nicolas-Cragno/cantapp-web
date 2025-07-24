import empresas from "./data/empresas.json";
import { listarColeccion } from "./db-functions";

// Nombre de empresas
export function nombreEmpresa(cuit) {
    if (cuit === null || cuit === undefined) return "SIN ASIGNAR";
    return empresas[String(cuit)] || "SIN ASIGNAR";
}

// Cuit de empresas
export const obtenerCuitPorNombre = (nombreEmpresa) => {
  if (!nombreEmpresa || typeof nombreEmpresa !== "string") return 0;

  for (const [cuit, nombre] of Object.entries(empresas)) {
    if (nombre === nombreEmpresa.trim().toUpperCase()) {
      return cuit;
    }
  }

  return 0;
};

// Buscar DNI 
export const buscarDNI = async (nombreCompleto) => {
  const personas = await listarColeccion("personas");

  const persona = personas.find(p => 
    `${p.apellido}, ${p.nombres}`.toUpperCase() === nombreCompleto.trim().toUpperCase()
  );

  return persona ? persona.dni : null;
};

// Buscar nombre completo
export const buscarPersona = async (dni) => {
  const personas = await listarColeccion("personas");

  const persona = personas.find(p => Number(p.dni) === Number(dni));

  return persona ? `${persona.apellido}, ${persona.nombres}` : null;
};

// Dar formato de fecha DD/MM/AAAA al dato desde db
export const formatearFecha = (fechaInput) => {
  if (!fechaInput) return "";

  // Si es Timestamp Firestore
  if (fechaInput.seconds !== undefined && fechaInput.nanoseconds !== undefined) {
    // convertís a Date usando toDate()
    fechaInput = new Date(fechaInput.seconds * 1000 + fechaInput.nanoseconds / 1000000);
  } else if (typeof fechaInput.toDate === "function") {
    // Otra forma para Timestamp Firestore
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

/*
export const formatearFechaInput = (fecha) => {
  if (!fecha) return "";
  const f = new Date(fecha);
  return f.toISOString().split("T")[0]; // yyyy-mm-dd
};
*/

export const formatearFechaInput = (fecha) => {
  if (!fecha) return "";

  const f = new Date(fecha);

  if (isNaN(f.getTime())) return ""; // <-- evita el error

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
