import unidades from "./data/unidades.json";
//import proveedores from "./data/proveedores.json";
import { useData } from "../context/DataContext";
import {  doc,updateDoc, getDoc,arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";


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

export const buscarEmpresa = (coleccion, cuit, completo=true) => {
  if (!cuit || !Array.isArray(coleccion)) return "";
  const empresa = coleccion.find((e) => e.cuit === cuit || e.id === cuit);
  if (!empresa) return "";
  const nombreCompleto = `${empresa.nombre}`;
  const abreviatura = `${empresa.abreviatura}`;
  return completo ? nombreCompleto : abreviatura;
}

export const buscarCuitEmpresa = (coleccion, nombre, verificar=false) => {
  if(!nombre) return 0;

  const empresa = coleccion.find((e) => e.nombre.toUpperCase() === nombre.toUpperCase());

  if(verificar){
    if(empresa){
      if(empresa.tipo === "propia") {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  
  if(!empresa) 
    return 0;
  const cuit = empresa.cuit || empresa.id;
  return cuit;
}

export const verificarDuplicado = (coleccion, idx) => {
  return coleccion.some((p) => String(p.idx) === String(idx));
};
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

export const buscarPersona = (coleccion, dni, completo = true) => {
  if (!dni) return "";

  const dniStr = String(dni);
  const persona = coleccion.find((p) => p.dni === dniStr || p.id === dniStr);
  if (!persona) return "";

  // Usar 'nombres' si existe, si no fallback a 'nombre', si no ""
  const nombres = persona.nombres ?? persona.nombre ?? "";

  const nombreCompleto = `${persona.apellido ?? ""}, ${nombres}`;
  const nombreAbreviado = nombres
    ? `${persona.apellido ?? ""}, ${nombres[0]}.`
    : persona.apellido ?? "";

  return completo ? nombreCompleto : nombreAbreviado;
};

export const normalizarFecha = (valor) => {
  if (!valor) return null;

  if (valor.toDate) {
    return valor.toDate(); // Timestamp Firestore
  }

  if (valor instanceof Date) {
    return valor;
  }

  if (typeof valor === "string") {
    const limpio = valor.trim();
    // ISO string
    if (!isNaN(Date.parse(limpio))) {
      return new Date(limpio);
    }
    // formato "YYYY-MM-DD"
    const partes = limpio.split("-");
    if (partes.length === 3) {
      const [year, month, day] = partes.map(Number);
      return new Date(year, month - 1, day);
    }
  }

  return null;
};

export const calcularEdad = (fechaNacimiento) => {
  const fecha = normalizarFecha(fechaNacimiento);
  if (!fecha) return null;

  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  return edad;
};




// ----------------------------------------------------------------------- Vehiculos

export const useBuscarDominio = (interno, tipo = "tractor") => {
  const {tractores, furgones} = useData();
  const valorError = "";
  let vehiculo = null;

  if(!interno) return valorError;

  if(tipo==="tractor"){
   vehiculo = tractores.find((t) => String(t.interno) === String(interno) || String(t.id) === String(interno)); 
  } else{
    vehiculo = furgones.find((f) => String(f.interno) === String(interno) || String(f.id) === String(interno));
  }

  return vehiculo ? vehiculo.dominio : valorError;
}

export const buscarDominio = (interno, coleccion = []) => {
  if (!interno || !Array.isArray(coleccion)) return "";

  const vehiculo = coleccion.find((v) => String(v.interno) === String(interno) || String(v.id) === String(interno));

  return vehiculo ? vehiculo.dominio : "";
};

export const minimizarVehiculo = (tipoVehiculo) => {
  let tipo;
  switch(tipoVehiculo.toUpperCase()){
    case "TRACTORES": tipo = "TRACTOR"; break;
    case "FURGONES": tipo = "FURGON"; break;
    default: tipo = "VEHICULO"; break;

  }
  return tipo;
}

export const buscarMarca = (id, coleccion = []) => {
  if (!id || !Array.isArray(coleccion)) return "";

  const vehiculo = coleccion.find((v) => String(v.id) === String(id) || String(v.dominio) === String(id));

  return vehiculo ? vehiculo.marca : "";
};

// ----------------------------------------------------------------------- Stock

export const buscarRepuestoPorID = async (coleccion, id) => {
  if (!id || !Array.isArray(coleccion)) return "";

  const articulo = coleccion.find((v) => String(v.id) === String(id));

  return articulo ? articulo.descripcion : "";
}
export const codigoStock = async (coleccion, tipo, prefijo, proveedor="01") => {
    

   const articulosTipoProv = coleccion.filter(
    (a) =>
      a.tipo?.toLowerCase() === tipo.toLowerCase() &&
      a.id?.startsWith(`${prefijo}${proveedor}`)
  );

    const maxNum = articulosTipoProv.reduce((max, art) => {
  const numero = art.id ? parseInt(art.id.slice(-4), 10) : 0;
  return numero > max ? numero : max;
}, 0);


  const nuevoNumero = maxNum + 1;
  return `${prefijo}${proveedor}${String(nuevoNumero).padStart(4, "0")}`;
};
export const marcaPorCodigo = (coleccion, codigo) => {
  if (!codigo || !coleccion) return "GENERICO";

  const prov = Object.values(coleccion).find((p) => p.id === codigo);

  return prov && prov.marca ? prov.marca.toUpperCase() : "GENERICO";
};
export const sumarCantidadStock = async (idArticulo, cantidadASumar) => {
  try {
    const ref = doc(db, "stock", idArticulo);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error("Artículo no encontrado");
    }

    const data = snap.data();
    const nuevaCantidad = (data.cantidad || 0) + cantidadASumar;

    await updateDoc(ref, { cantidad: nuevaCantidad });

    return nuevaCantidad;
  } catch (error) {
    console.error("Error al sumar cantidad al stock:", error);
    throw error;
  }
};
export const sumarMultiplesCantidades = async (ingresosMap) => {
  try {
    for (const [idArticulo, cantidadASumar] of Object.entries(ingresosMap)) {
      const ref = doc(db, "stock", idArticulo);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        console.warn(`Artículo con ID ${idArticulo} no encontrado`);
        continue; // o lanzar error si preferís
      }

      const data = snap.data();
      const nuevaCantidad = (data.cantidad || 0) + cantidadASumar;

      await updateDoc(ref, { cantidad: nuevaCantidad });
    }
  } catch (error) {
    console.error("Error al actualizar múltiples cantidades:", error);
    throw error;
  }
};
export const idNuevoProveedor = (proveedores = []) => {
  if (!Array.isArray(proveedores) || proveedores.length === 0) return "01";

  
  const idsNumericos = proveedores
    .map((p) => parseInt(p.id, 10))
    .filter((n) => !isNaN(n));

  if (idsNumericos.length === 0) return "01";

  
  const maxId = Math.max(...idsNumericos);
  const nuevoId = maxId + 1;

  
  return nuevoId.toString().padStart(2, "0");
};
export const agregarStockADeposito = async (idDeposito, nuevoItem) => {
  try {
    const ref = doc(db, "depositos", idDeposito);

    await updateDoc(ref, {
      stock: arrayUnion({
        id: nuevoItem.id,
        cantidad: nuevoItem.cantidad,
        unidad: nuevoItem.unidad,
      }),
    });

    console.log(`Stock agregado a depósito: ${idDeposito}`);
  } catch (error) {
    console.error("Error al agregar stock al depósito:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------- Validaciones

export const verificarEstado = (empresa) => {

}

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

export const calcularTiempo = (inicio, fin = new Date()) => {
  const fechaInicio = normalizarFecha(inicio);
  const fechaFin = normalizarFecha(fin);

  if (!fechaInicio || !fechaFin) return null;

  let años = fechaFin.getFullYear() - fechaInicio.getFullYear();
  let meses = fechaFin.getMonth() - fechaInicio.getMonth();

  if (meses < 0) {
    años--;
    meses += 12;
  }

  if (años < 0) return null;

  let texto = "";
  if (años > 0) texto += `${años} año${años > 1 ? "s" : ""}`;
  if (meses > 0) texto += `${años > 0 ? " y " : ""}${meses} mes${meses > 1 ? "es" : ""}`;

  return texto || "menos de un mes";
};

// ----------------------------------------------------------------------- valores / unidades

export const obtenerNombreUnidad = (abreviatura) => {
  return Object.entries(unidades).find(([, abrev]) => abrev === abreviatura)?.[0] || "";
};

export const abreviarUnidad = (unidad) => {
  return unidades[unidad] || ""; 
}

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

export const unidadArticulo = (coleccion, id) => {
    if (!id || !Array.isArray(coleccion)) return "";

    const articulo = coleccion.find((a) => a.id === id);

    return articulo ? articulo.unidad : "no";
}
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
  
};