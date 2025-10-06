import { useState, useEffect } from "react";
import "./css/Forms.css";
import Swal from "sweetalert2";
import {
  agregarViaje,
  modificar,
  listarColeccion,
} from "../../functions/db-functions";
import { formatearFecha } from "../../functions/data-functions";

export default function FormViaje({ viaje = {}, onClose, onGuardar }) {
  const [formData, setFormData] = useState({
    fecha: viaje.fecha
      ? formatearFecha(viaje.fecha)
      : formatearFecha(new Date()),
    chofer: viaje.chofer || "",
    tractor: viaje.tractor || "",
    satelital: viaje.satelital || "",
    litrosticket: viaje.litrosticket || 0,
    litrosreales: viaje.litrosreales || 0,
    km: viaje.km || 0,
    diferencia: viaje.diferencia || 0,
    promedio: viaje.promedio || 0,
    detalle: viaje.detalle || "",
  });

  const fechaFormateada = viaje.fecha ? formatearFecha(viaje.fecha) : "-";

  const [choferes, setChoferes] = useState([]);
  const [tractores, setTractores] = useState([]);
  const [satelitales, setSatelitales] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const personas = await listarColeccion("personas");
        setChoferes(personas.filter((p) => p.puesto.includes("CHOFER")));
        setTractores(await listarColeccion("tractores"));
        setSatelitales(
          (await listarColeccion("satelitales")).filter(
            (s) => s.combustible === true
          )
        );
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        fecha: new Date(formData.fecha),
        tractor: formData.tractor ? Number(formData.tractor) : null,
        litrosticket: Number(formData.litrosticket),
        litrosreales: Number(formData.litrosreales),
        km: Number(formData.km),
        diferencia: Number(formData.diferencia),
        promedio: Number(formData.promedio),
      };

      if (viaje.id) {
        await modificar("viajes", viaje.id, data);
      } else {
        await agregarViaje(data);
      }

      Swal.fire("Éxito", "Viaje guardado correctamente", "success");
      if (onGuardar) onGuardar(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar viaje:", error);
      Swal.fire("Error", "No se pudo guardar el viaje", "error");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{viaje.id ? "Editar Viaje" : "Nuevo Viaje"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Fecha</label>
          <input
            type="date"
            value={formData.fecha}
            onChange={(e) =>
              setFormData({ ...formData, fecha: e.target.value })
            }
          />

          <label>Chofer</label>
          <select
            value={formData.chofer}
            onChange={(e) =>
              setFormData({ ...formData, chofer: e.target.value })
            }
          >
            <option value="">Seleccione un chofer</option>
            {choferes.map((c) => (
              <option key={c.id} value={c.apellidoNombre}>
                {c.apellidoNombre}
              </option>
            ))}
          </select>

          <label>Tractor</label>
          <select
            value={formData.tractor}
            onChange={(e) => {
              const tractor = tractores.find(
                (t) => String(t.interno) === String(e.target.value)
              );
              setFormData({
                ...formData,
                tractor: e.target.value,
                satelital: tractor?.satelital || "",
              });
            }}
          >
            <option value="">Seleccione un tractor</option>
            {tractores.map((t) => (
              <option key={t.id} value={t.interno}>
                {t.interno}
              </option>
            ))}
          </select>

          <label>Satelital</label>
          <select
            value={formData.satelital}
            onChange={(e) =>
              setFormData({ ...formData, satelital: e.target.value })
            }
          >
            <option value="">Seleccione satelital</option>
            {satelitales.map((s) => (
              <option key={s.id} value={s.nombre}>
                {s.nombre}
              </option>
            ))}
          </select>

          <label>Litros Ticket</label>
          <input
            type="number"
            value={formData.litrosticket}
            onChange={(e) =>
              setFormData({ ...formData, litrosticket: e.target.value })
            }
          />

          <label>Litros Reales</label>
          <input
            type="number"
            value={formData.litrosreales}
            onChange={(e) =>
              setFormData({ ...formData, litrosreales: e.target.value })
            }
          />

          <label>Kilómetros</label>
          <input
            type="number"
            value={formData.km}
            onChange={(e) => setFormData({ ...formData, km: e.target.value })}
          />

          <label>Diferencia</label>
          <input
            type="number"
            value={formData.diferencia}
            onChange={(e) =>
              setFormData({ ...formData, diferencia: e.target.value })
            }
          />

          <label>Promedio</label>
          <input
            type="number"
            value={formData.promedio}
            onChange={(e) =>
              setFormData({ ...formData, promedio: e.target.value })
            }
          />

          <label>Detalle</label>
          <textarea
            value={formData.detalle}
            onChange={(e) =>
              setFormData({ ...formData, detalle: e.target.value })
            }
          />

          <button type="submit">
            {viaje.id ? "Guardar cambios" : "Agregar viaje"}
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
