// ----------------------------------------------------------------------- imports externos
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------- internos
import { useData } from "../../context/DataContext";
import { agregar, modificar } from "../../functions/dbFunctions";
import {
  buscarEmpresa,
  buscarCuitEmpresa,
  verificarDuplicado,
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

  const { empresas, tractores, furgones, utilitarios } = useData();
  const modoEdicion = !!vehiculo;

  const [interno, setInterno] = useState("");
  const [dominio, setDominio] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [detalle, setDetalle] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar datos en modo edición
  useEffect(() => {
    if (modoEdicion && vehiculo) {
      setInterno(vehiculo.interno ? String(vehiculo.interno) : "");
      setDominio(vehiculo.dominio || "");
      setMarca(vehiculo.marca || "");
      setModelo(vehiculo.modelo || "");
      setEmpresa(buscarEmpresa(empresas, vehiculo.empresa) || "");
      setDetalle(vehiculo.detalle || "");
    }
  }, [modoEdicion, vehiculo, empresas]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setLoading(true);

    try {
      const vehiculoData = {
        interno: String(interno).trim(),
        dominio: dominio.toUpperCase().trim(),
        marca: marca.toUpperCase().trim(),
        modelo: modelo,
        empresa: buscarCuitEmpresa(empresas, empresa) || "",
        detalle: detalle.toUpperCase().trim(),
      };

      if (modoEdicion) {
        await modificar(
          tipoVehiculo.toLowerCase(),
          vehiculo.interno,
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
        const existeInterno = await verificarDuplicado(lista, interno);
        if (existeInterno) {
          Swal.fire({
            title: "Duplicado",
            text: `El interno ${interno} ya se encuentra asignado.`,
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#4161bd",
          });
          setLoading(false);
          return;
        }

        const vehiculoAgregado = await agregar(
          tipo.toLowerCase(),
          vehiculoData,
          vehiculoData.interno
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
          {modoEdicion ? "MODIFICAR" : "NUEVO"} {tipo.toUpperCase()}
        </h2>
        <form onSubmit={handleSubmit}>
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

          <label>
            Dominio
            <input
              type="text"
              value={dominio}
              onChange={(e) => setDominio(e.target.value)}
              disabled={loading}
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
              <option value="">Seleccionar empresa...</option>
              {empresas.map((e) => (
                <option key={e.cuit} value={e.nombre}>
                  {e.nombre}
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
