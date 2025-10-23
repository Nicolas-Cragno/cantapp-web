import { useData } from "../../context/DataContext";

const SelectPersonas = ({
  value,
  onChange,
  puesto = null,
  name = "persona",
}) => {
  const { personas } = useData();

  return (
    <select name={name} value={value} onChange={onChange}>
      <option value={""}></option>
      {personas.map((p) => (
        <option key={p.dni} value={p.dni}>
          {p.apellido} {p.nombres} ({p.dni})
        </option>
      ))}
    </select>
  );
};

export default SelectPersonas;
