// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { agregar, modificar } from "../../functions/dbFunctions";
import {
  buscarEmpresa,
  buscarCuitEmpresa,
  verificarDuplicado,
  minimizarVehiculo,
  buscarPersona,
} from "../../functions/dataFunctions";

// ----------------------------------------------------------------------- visuales, logos, etc
import "./css/Forms.css";

const FormVehiculo = ({
  tipoVehiculo,
  vehiculo = null,
  onClose,
  onGuardar,
}) => {
  const tipo =
    typeof tipoVehiculo === "string" ? tipoVehiculo : tipoVehiculo?.value || "";

  const { empresas, tractores, furgones, utilitarios, personas } = useData();
  const modoEdicion = !!vehiculo;
  const tipoDefault = tipoVehiculo ? tipoVehiculo : "tractores";

  const [bloquearSwitch, setBloquearSwitch] = useState(
    tipoVehiculo !== null || tipoVehiculo !== "" ? true : false
  );
  const [interno, setInterno] = useState("");
  const [dominio, setDominio] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [persona, setPersona] = useState("");
  const [detalle, setDetalle] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(tipoDefault);

  // Cargar datos en modo edición
  useEffect(() => {
    if (modoEdicion && vehiculo) {
      setInterno(vehiculo.interno ? String(vehiculo.interno) : "");
      setDominio(vehiculo.dominio || "");
      setMarca(vehiculo.marca || "");
      setModelo(vehiculo.modelo || "");
      setEmpresa(buscarEmpresa(empresas, vehiculo.empresa) || "");
      setDetalle(vehiculo.detalle || "");
      setPersona(vehiculo.persona || "");
    }
  }, [modoEdicion, vehiculo, empresas]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tipoVehiculo !== "vehiculos") {
      if (!String(interno.trim()) || !String(dominio.trim())) {
        Swal.fire({
          title: "Faltan datos",
          text: "Complete los campos obligatorios.",
          icon: "question",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#4161bd",
        });
        return;
      }
    } else {
      if (!String(dominio.trim())) {
        Swal.fire({
          title: "Faltan datos",
          text: "Complete los campos obligatorios.",
          icon: "question",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#4161bd",
        });
        return;
      }
    }

    setLoading(true);

    const vehiculoData = {
      interno:
        tipoSeleccionado !== "vehiculo"
          ? String(interno).trim()
          : dominio.toUpperCase(),
      dominio: dominio.toUpperCase().trim(),
      marca: marca.toUpperCase().trim(),
      modelo: modelo,
      empresa: buscarCuitEmpresa(empresas, empresa) || null,
      estado: empresa ? true : false,
      detalle: detalle.toUpperCase().trim(),
      persona: persona || null,
      estado: buscarEmpresa(empresas, empresa, true), // para verificar devuelve t o f
    };

    try {
      const identificador =
        tipoSeleccionado === "vehiculos" ? dominio.toUpperCase() : interno;

      if (modoEdicion) {
        await modificar(
          tipoVehiculo.toLowerCase(),
          identificador,
          vehiculoData
        );
        if (onGuardar) onGuardar(vehiculoData);
      } else {
        const lista =
          tipo === "tractores"
            ? tractores
            : tipo === "furgones"
            ? furgones
            : utilitarios;
        const existeInterno = await verificarDuplicado(lista, identificador);
        if (existeInterno) {
          Swal.fire({
            title: "Duplicado",
            text: `El interno o patente ${identificador} ya se encuentra registrado.`,
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#4161bd",
          });
          setLoading(false);
          return;
        }

        const vehiculoAgregado = await agregar(
          tipoSeleccionado.toLowerCase(),
          vehiculoData,
          identificador
        );
        if (onGuardar) onGuardar(vehiculoAgregado);
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar vehículo: ", error);
      Swal.fire({
        title: "Error",
        text: "No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>
          {modoEdicion ? "MODIFICAR" : "NUEVO"} {minimizarVehiculo(tipo)}
        </h2>
        {/* Tipo de ingreso /tractor/ /particular/ */}
        {!bloquearSwitch ? (
          <>
            <div className="type-container-small">
              <button
                type="button"
                className={
                  tipoSeleccionado === "tractores"
                    ? "type-btn positive-active-black"
                    : "type-btn"
                }
                onClick={() => setTipoSeleccionado("tractores")}
              >
                TRACTOR {tipoSeleccionado === "tractores" ? " *" : null}{" "}
              </button>
              <button
                type="button"
                className={
                  tipoSeleccionado === "furgones"
                    ? "type-btn positive-active-black"
                    : "type-btn"
                }
                onClick={() => setTipoSeleccionado("furgones")}
              >
                FURGON {tipoSeleccionado === "furgones" ? " *" : null}{" "}
              </button>
              <button
                type="button"
                className={
                  tipoSeleccionado === "vehiculos"
                    ? "type-btn positive-active-black"
                    : "type-btn"
                }
                onClick={() => setTipoSeleccionado("vehiculos")}
              >
                OTRO {tipoSeleccionado === "vehiculos" ? " *" : null}{" "}
              </button>
            </div>
          </>
        ) : null}
        <form onSubmit={handleSubmit}>
          {tipoSeleccionado === "tractores" ||
          tipoSeleccionado === "furgones" ? (
            <>
              <label>
                Interno
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={3}
                  value={interno}
                  onChange={(e) => setInterno(e.target.value)}
                  disabled={modoEdicion || loading}
                />
              </label>
            </>
          ) : null}

          <label>
            Dominio
            <input
              type="text"
              value={dominio}
              onChange={(e) => setDominio(e.target.value)}
              disabled={
                (tipoVehiculo === "vehiculos" && modoEdicion) || loading
              }
            />
          </label>

          <label>
            Marca
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              disabled={loading}
            />
          </label>

          <label>
            Modelo
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={4}
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              disabled={modoEdicion || loading}
            />
          </label>

          <label>
            Empresa
            <select
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              disabled={loading}
            >
              <option value=""></option>
              {empresas
                .filter((e) => e.tipo === "propia")
                .map((e) => (
                  <option key={e.cuit} value={e.nombre}>
                    {e.nombre}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Persona asignada / Dueño
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              disabled={loading}
            >
              <option value=""></option>
              {personas
                .sort((a, b) => a.apellido.localeCompare(b.apellido))
                .map((e) => (
                  <option key={e.id} value={e.dni}>
                    {e.apellido}, {e.nombres} (DNI: {e.dni})
                  </option>
                ))}
            </select>
          </label>

          <label>
            Detalle
            <textarea
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              disabled={loading}
            />
          </label>

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormVehiculo;
