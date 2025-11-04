import unidades from "./data/unidades.json";
//import proveedores from "./data/proveedores.json";
import { useData } from "../context/DataContext";
import {  doc,updateDoc, getDoc,arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Swal from "sweetalert2";
import { modificar } from "./dbFunctions";


export const buscarId = (coleccion, campo, valor) => {
  if(!coleccion || !campo || !valor) return "";
  const campoStr = String(campo);
  const valorStr = String(valor);
  const resultado = coleccion.find((element) => element[campoStr] === String(valorStr));

  if(!resultado) console.log("[Error] No se encontró un id");

  return resultado ? resultado.id : "";
}

// ----------------------------------------------------------------------- Nombre de empresas
export const useNombreEmpresa = (cuit) => {
  const { empresas } = useData();
  const nombreError = "SIN ASIGNAR";

  if (!cuit){
    return nombreError;
  }

  const empresa = empresas.find((e) => e.id === cuit || e.cuit === cuit);
  if(!empresa) {console.log(`[Error] useNombreEmpresa espera un 'cuit' por parámetro.`);}
  return empresa ? empresa.nombre : nombreError;
}
export const useObtenerCuitPorNombre = (nombreEmpresa) => {
  const {empresas} = useData();
  const valorError = 0;

  if(!nombreEmpresa || typeof nombreEmpresa !== "string") {
    return valorError;
  }

  const empresa = empresas.find((e) => e.nombre === nombreEmpresa);
  if(!empresa){    console.log(`[Error] useObtenerCuitPorNombre esperaba un nombreEmpresa(string) por parámetro.`);
}
  return empresa ? empresa.cuit : valorError;
}
export const buscarEmpresa = (coleccion, cuit, completo=true) => {
  if (!cuit || !Array.isArray(coleccion)){
    return "";
  }
  const empresa = coleccion.find((e) => e.cuit === cuit || e.id === cuit);
  if (!empresa){
    console.log(`[Error] buscarEmpresa no encontró una empresa con el cuit ${cuit}.`) 
    return "";}
  const nombreCompleto = `${empresa.nombre}`;
  const abreviatura = `${empresa.abreviatura}`;
  return completo ? nombreCompleto : abreviatura;
}
export const buscarCuitEmpresa = (coleccion, nombre, verificar=false) => {
  if(!nombre){
    return 0;
  } 

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
  
  if(!empresa) {
    console.log(`[Error] buscarCuitEmpresa no encontró una empresa con el nombre ${String(nombre)}`)
    return 0;
  }
  const cuit = empresa.cuit || empresa.id;
  return cuit;
}
export const verificarDuplicado = (coleccion, idx) => {
  return coleccion.some((p) => String(p.idx) === String(idx));
};
export const buscarNombre = (coleccion, idx) => {
  try {
    if (!coleccion) {
      console.warn("[Aviso] buscarNombre recibió una colección nula o indefinida");
      return "";
    }

    let array = [];

    // Si es un array
    if (Array.isArray(coleccion)) {
      array = coleccion;
    }

    // Si es un objeto, lo convertimos a array de { id, ...data }
    else if (typeof coleccion === "object" && Object.keys(coleccion).length > 0) {
      array = Object.entries(coleccion).map(([id, data]) => ({
        id,
        ...data,
      }));
    }

    // Si no logramos obtener un array válido
    else {
      console.error(
        "[Error] buscarNombre recibió un tipo no manejable:",
        typeof coleccion,
        coleccion
      );
      return "";
    }

    // Buscar por id
    const valor = array.find((v) => String(v.id) === String(idx));

    if (!valor) {
      console.warn(`[Aviso] buscarNombre no encontró coincidencia para id ${idx}`);
      return "";
    }

    // Devolver el campo más representativo
    return valor.nombre || valor.descripcion || valor.razonSocial || "";
  } catch (err) {
    console.error("[Error en buscarNombre]:", err);
    return "";
  }
};




// ----------------------------------------------------------------------- Personas

export const useBuscarDni = (nombrePersona) => {
  const {personas} = useData();
  const valorError = 0;

  if(!nombrePersona || typeof nombrePersona !== "string") 
  {
    return valorError;
  }

  const persona = personas.find((p) => p.apellido + ", " + p.nombres === nombrePersona || p.apellido + ", " + p.nombres[0] + "." === nombrePersona);
  if(!persona){    console.log(`[Error] useBuscarDni esperaba un nombrePersona(string) como parametro.`)
};
  return persona ? persona.dni : valorError;
}
export const useBuscarPersona = (dni, completo=true) => {
  const {personas} = useData();
  const valorError = "";

  if(!dni){
    return valorError;
  } 

  const persona = personas.find((p) => p.dni === dni || p.id === dni);
  if(!persona){ 
    console.log(`[Error] useBuscarPersona no encontró persona con dni/id igual a ${String(dni)} `)
    return valorError;}
  const nombreCompleto = `${persona.apellido}, ${persona.nombres}`;
  const nombreAbreviado = `${persona.apellido}, ${persona.nombres[0]}`;

  return completo ? nombreCompleto : nombreAbreviado;
}
export const buscarPersona = (coleccion, dni, completo = true) => {
  if (!dni){ 
    return "";}

  const dniStr = String(dni);
  const persona = coleccion.find((p) => p.dni === dniStr || p.id === dniStr);
  if (!persona){
    return "";
  } 

  // Usar 'nombres' si existe, si no fallback a 'nombre', si no ""
  const nombres = persona.nombres ?? persona.nombre ?? "";

  const nombreCompleto = `${persona.apellido ?? ""}, ${nombres}`;
  const nombreAbreviado = nombres
    ? `${persona.apellido ?? ""}, ${nombres[0]}.`
    : persona.apellido ?? "";

  return completo ? nombreCompleto : nombreAbreviado;
};
export const normalizarFecha = (valor) => {
  if (!valor){
    return null;
  }

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
  if (!fecha){
    return null;
  } 

  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  

  return edad;
};
export const iniciarPeriodo = async (
  idPersona,
  datos
) => {
  try {
    if (!idPersona) throw new Error(`[Error] iniciarPeriodo espera un idPersona válido.`);

    const personaRef = doc(db, "personas", String(idPersona));

    const nuevoPeriodo = {
      id: Date.now(), // ID temporal o local
      empresa: datos.empresa || "",
      puesto: datos.puesto || "",
      inicio: normalizarFecha(datos.fechaInicio),
      fin: null,
      observaciones: datos.observaciones,
    };

    await updateDoc(personaRef, {
      periodos: arrayUnion(nuevoPeriodo),
    });

    console.log(`Periodo agregado a persona ${idPersona}`);
    return nuevoPeriodo;
  } catch (error) {
    console.error("[Error] al iniciar periodo:", error);
    throw error;
  }
};
export const finalizarPeriodo = async (idPersona, cuitEmpresa=null, fechaFin = new Date()) => {
  try {
    if (!idPersona) throw new Error(`[Error] finalizarPeriodo esperaba un idPersona válido por parámetro.`);
   

    const personaRef = doc(db, "personas", String(idPersona));
    const snap = await getDoc(personaRef);

    if (!snap.exists()) throw new Error(`[Error] finalizarPeriodo no encontró persona con dni/id ${String(idPersona)}`);

    const data = snap.data();
    const periodos = Array.isArray(data.periodos) ? [...data.periodos] : [];

    // Buscar el primer periodo con fin == null
    const indexActivo = periodos.findIndex((p) => p.fin == null);
    let inicioPeriodo;

    if (indexActivo === -1) {
      const { value: fechaInicio } = await Swal.fire({
        title: "Periodo no encontrado",
        text: "La baja no puede asignarse a otro periodo de contratación registrado. Por favor, ingrese la fecha de inicio del mismo:",
        input: "date",
        inputValue: new Date().toISOString().split("T")[0],
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Finalizar sin fecha de inicio",
        inputValidator: (value) => {
          if (!value) return "[Error] finalizarPeriodo espera una fecha de inicio válida.";
        },
      });

      // Si el usuario cancela, abortar la operación
      if (!fechaInicio) {
        console.log(`Finalización de periodo del dni ${String(idPersona)} cancelada`);
        inicioPeriodo = null;
      } else {
        inicioPeriodo = fechaInicio;
      }

      const nuevoPeriodo = {
        empresa: cuitEmpresa ? cuitEmpresa : "",
        puesto: "",
        inicio: inicioPeriodo !== null ? normalizarFecha(new Date(inicioPeriodo)) : null,
        fin: normalizarFecha(fechaFin),
        observaciones: "Periodo creado para registrar baja sin periodo previo",
      };

      await updateDoc(personaRef, {
        periodos: arrayUnion(nuevoPeriodo),
      });

      console.log(
        `[Aviso] No se encontró periodo activo, se creó uno nuevo cerrado para persona ${String(idPersona)}`
      );
      return nuevoPeriodo;
    }

    // Si hay un periodo activo, cerrarlo
    periodos[indexActivo] = {
      ...periodos[indexActivo],
      fin: normalizarFecha(fechaFin),
    };

    await updateDoc(personaRef, { periodos });

    console.log(`Periodo finalizado para persona ${idPersona}`);
    return periodos[indexActivo];
  } catch (error) {
    console.error("[Error] Error al finalizar periodo: ", error);
    throw error;
  }
};
// ----------------------------------------------------------------------- Vehiculos

export const useBuscarDominio = (interno, tipo = "tractor") => {
  const {tractores, furgones} = useData();
  const valorError = "";
  let vehiculo = null;

  if(!interno){
    return valorError;
  } 

  if(tipo==="tractor"){
   vehiculo = tractores.find((t) => String(t.interno) === String(interno) || String(t.id) === String(interno)); 
  } else{
    vehiculo = furgones.find((f) => String(f.interno) === String(interno) || String(f.id) === String(interno));
  }

  return vehiculo ? vehiculo.dominio : valorError;
}
export const buscarDominio = (interno, coleccion = []) => {
  if (!interno || !Array.isArray(coleccion))
  {
    return "";
  }

  const vehiculo = coleccion.find((v) => String(v.interno) === String(interno) || String(v.id) === String(interno));
 ;

  return vehiculo ? vehiculo.dominio : "";
};
export const minimizarVehiculo = (tipoVehiculo) => {
  if(!tipoVehiculo) {
    return "";
  }
  let tipo;
  switch(tipoVehiculo.toUpperCase()){
    case "TRACTORES": tipo = "TRACTOR"; break;
    case "FURGONES": tipo = "FURGON"; break;
    default: tipo = "VEHICULO"; break;
  }
  return tipo;
}
export const buscarMarca = (id, coleccion = []) => {
  if (!id || !Array.isArray(coleccion)){
    return "";
  } 

  const vehiculo = coleccion.find((v) => String(v.id) === String(id) || String(v.dominio) === String(id));
if(!vehiculo) {    console.log(`[Error] buscarMarca esperaba un id y/o una colección(array) valido/s`)
};
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
export const agregarFaltante = async (coleccion, idDoc, repuestoId, cantidad, unidad) => {
  try {
    const docRef = doc(db, coleccion, String(idDoc));
    const snap = await getDoc(docRef);

    const data = snap.exists() ? snap.data() : {};
    const faltantesActuales = Array.isArray(data.faltante) ? data.faltante : [];

    const index = faltantesActuales.findIndex((r) => r.id === repuestoId);

    if (index !== -1) {
      // Si ya existe, se suma
      faltantesActuales[index].cantidad += cantidad;
    } else {
      // Si no existe se agrega
      faltantesActuales.push({ id: repuestoId, cantidad, unidad });
    }

    await modificar(coleccion, idDoc, { faltante: faltantesActuales });
    return true;
  } catch (err) {
    console.error(`[Error] Agregando repuesto ${repuestoId} a ${coleccion}/${idDoc}:`, err);
    throw err;
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

  let f;

  if (fecha.seconds !== undefined && fecha.nanoseconds !== undefined) {
    // Caso Firestore Timestamp
    f = new Date(fecha.seconds * 1000 + fecha.nanoseconds / 1000000);
  } else if (typeof fecha.toDate === "function") {
    // Caso Timestamp con método .toDate()
    f = fecha.toDate();
  } else {
    f = new Date(fecha);
  }

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