import { useState, useEffect } from "react";

const FormMecanico = ({ inicial = {}, onSubmit, onCancel }) => {
  const [nombres, setNombres] = useState("");
  const [apellido, setApellido] = useState("");
  const [detalle, setDetalle] = useState("");

  useEffect(() => {
    if (inicial) {
      setNombres(inicial.nombres || "");
      setApellido(inicial.apellido || "");
      setDetalle(inicial.detalle || "");
    }
  }, [inicial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mecanico = {
      nombres,
      apellido,
      detalle,
      rol: "mecanico",
    };
    onSubmit(mecanico);
  };

  return (
    <form className="mecanicos-formulario" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombres}
        onChange={(e) => setNombres(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Detalle (opcional)"
        value={detalle}
        onChange={(e) => setDetalle(e.target.value)}
      />
      <div className="formulario-botones">
        <button type="submit">Guardar</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormMecanico;
