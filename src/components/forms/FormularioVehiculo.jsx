import { useState, useEffect } from "react";
import "../css/Forms.css";
import empresas from "../../functions/data/empresas.json";
import { agregar, listarColeccion, modificar } from "../../functions/db-functions";
import { nombreEmpresa, obtenerCuitPorNombre } from "../../functions/data-functions";

const FormularioVehiculo = ({ tipoVehiculo, vehiculo = null, onClose, onGuardar }) => {
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

  const verificarInterno = async (nuevoInterno) => {
    const data = await listarColeccion(tipoVehiculo);
    return data.some((v) => v.interno === nuevoInterno);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!interno.trim() || !dominio.trim()) {
      alert("Complete los datos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      if (modoEdicion) {
        const vehiculoEditado = {
          interno,
          dominio: dominio.toUpperCase(),
          marca: marca.toUpperCase(),
          modelo: modelo,
          empresa: obtenerCuitPorNombre(empresa?.toUpperCase() || "") || "",
          detalle: detalle.toUpperCase()
        };

        await modificar(tipoVehiculo.toLowerCase(), vehiculo.interno, vehiculoEditado);
        if (onGuardar) onGuardar(vehiculoEditado);
      } else {
        const existeInterno = await verificarInterno(interno);
        if (existeInterno) {
          alert("Número de interno ya asignado.");
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

        const vehiculoAgregado = await agregar(tipoVehiculo, nuevoVehiculo, interno);
        if (onGuardar) onGuardar(vehiculoAgregado);
      }

      onClose();
    } catch (error) {
      alert("Ocurrió un error al guardar el vehículo.");
      console.error("Error al guardar vehículo: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <div className="form-content">
        <h2>{modoEdicion ? "MODIFICAR" : "NUEVO"} {tipoVehiculo.toUpperCase()}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Tipo
            <input type="text" value={tipoVehiculo} readOnly className="input-readonly" />
          </label>
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
            <input
              type="text"
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
