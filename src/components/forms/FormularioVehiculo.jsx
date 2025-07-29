import { useState, useEffect } from "react";
import "../css/Forms.css";
import Swal from "sweetalert2";
import empresas from "../../functions/data/empresas.json";
import { agregar, modificar, verificarInterno } from "../../functions/db-functions";
import { nombreEmpresa, obtenerCuitPorNombre } from "../../functions/data-functions";

const FormularioVehiculo = ({ tipoVehiculo, vehiculo = null, onClose, onGuardar }) => {
  const tipo = typeof tipoVehiculo === "string" ? tipoVehiculo : tipoVehiculo?.value || "";

  const [interno, setInterno] = useState("");
  const [dominio, setDominio] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [empresa, setEmpresa] = useState("SIN ASIGNAR");
  const [detalle, setDetalle] = useState("");
  const [loading, setLoading] = useState(false);

  const modoEdicion = !!vehiculo;

  useEffect(() => {
    if (modoEdicion && vehiculo) {
      setInterno(vehiculo.interno);
      setDominio(vehiculo.dominio);
      setMarca(vehiculo.marca);
      setModelo(vehiculo.modelo);
      setEmpresa(nombreEmpresa(vehiculo.empresa));
      setDetalle(vehiculo.detalle);
    }
  }, [modoEdicion, vehiculo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!String(interno).trim() || !String(dominio).trim()) {
      Swal.fire({
        title:"Faltan datos",
        text:"Complete los campos obligatorios.",
        icon: "question",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd"
      });
      return;
    }

    setLoading(true);

    try {
      if (modoEdicion) {
        const vehiculoEditado = {
          interno: String(interno),
          dominio: dominio.toUpperCase(),
          marca: marca.toUpperCase(),
          modelo: modelo,
          empresa: obtenerCuitPorNombre(empresa?.toUpperCase() || "") || "",
          detalle: detalle.toUpperCase(),
        };

        await modificar(tipo.toLowerCase(), String(vehiculo.interno), vehiculoEditado);

        if (onGuardar) onGuardar(vehiculoEditado);

      } else {
        const existeInterno = await verificarInterno(interno, tipoVehiculo);

        if (existeInterno) {
          Swal.fire({
            title:"Duplicado",
            text:"El interno" + interno + "ya se encuentra asignado.",
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#4161bd"
          })

          setLoading(false);
          return;
        }

        const nuevoVehiculo = {
          interno,
          dominio: dominio.toUpperCase(),
          marca: marca.toUpperCase(),
          modelo: modelo,
          empresa: obtenerCuitPorNombre(empresa),
          detalle: detalle.toUpperCase()
        };

        const vehiculoAgregado = await agregar(tipo.toLowerCase(), nuevoVehiculo, interno);
        if (onGuardar) onGuardar(vehiculoAgregado);
      }

      onClose();
    } catch (error) {
      Swal.fire({
        title:"Error",
        text:"No hemos podido procesar la solicitud.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4161bd"
      })

      console.error("Error al guardar vehículo: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>{modoEdicion ? "MODIFICAR" : "NUEVO"} {tipo.toUpperCase()}</h2>
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
              {Object.entries(empresas).map(([cuit, nombre]) => (
                <option key={cuit} value={nombre}>{nombre}</option>
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

export default FormularioVehiculo;
