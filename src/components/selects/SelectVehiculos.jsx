import { useData } from "../../context/DataContext";

const SelectVehiculos = ({ value, onChange, tipoVehiculo = "tractores" }) => {
  let listadoVehiculos, name;
  const { tractores, furgones, vehiculos } = useData();
  switch (tipoVehiculo.toLowerCase()) {
    case "tractores":
      listadoVehiculos = tractores;
      name = "tractor";
      break;
    case "furgones":
      listadoVehiculos = furgones;
      name = "furgon";
      break;
    default:
      listadoVehiculos = vehiculos;
      name = "vehiculo";
  }

  return (
    <select name={name} value={value} onChange={onChange}>
      <option value=""></option>
      {vehiculos.map((v) => (
        <option key={v.interno} value={v.interno}>
          {v.interno} ({v.dominio})
        </option>
      ))}
    </select>
  );
};

export default SelectVehiculos;
