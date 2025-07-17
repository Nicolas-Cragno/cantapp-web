import empresas from "./data/empresas.json";
import { listarColeccion } from "./db-functions";

// Nombre de empresas
export function nombreEmpresa(cuit) {
    return empresas[cuit] || "SIN ASIGNAR";
}

// Cuit de empresas
export const obtenerCuitPorNombre = (nombreEmpresa) => {
  for (const [cuit, nombre] of Object.entries(empresas)) {
    if (nombre === nombreEmpresa.trim().toUpperCase()) {
      return cuit;
    }
  }

  return "SIN ASIGNAR";
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
