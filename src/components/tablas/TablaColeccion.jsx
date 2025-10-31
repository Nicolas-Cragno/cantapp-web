import "./css/Tables.css";

const TablaColeccion = ({ columnas, datos, onRowClick = false }) => {
  const datosOrdenados = [...datos].sort((a, b) => {
    if (a.fecha && b.fecha) {
      const fechaA = a.fecha.seconds
        ? new Date(a.fecha.seconds * 1000)
        : new Date(a.fecha);
      const fechaB = b.fecha.seconds
        ? new Date(b.fecha.seconds * 1000)
        : new Date(b.fecha);
      return fechaB - fechaA;
    } else if (a.id && b.id) {
      return a.id
        .toString()
        .localeCompare(b.id.toString(), undefined, { numeric: true });
    } else {
      return 0;
    }
  });

  return (
    <div className="table-scroll-wrapper">
      <table className="table-lista">
        <thead className="table-titles">
          <tr>
            {columnas.map((col, index) => (
              <th
                key={index}
                className={
                  col.offresponsive
                    ? "off-responsive"
                    : col.onresponsive
                    ? "on-responsive"
                    : ""
                }
              >
                {col.titulo}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <div className="table-body-wrapper">
        <table className="table-lista">
          <tbody className="table-body">
            {datosOrdenados.map((item, index) => (
              <tr
                key={item.id || index}
                onClick={() => onRowClick && onRowClick(item)}
                className="table-item"
              >
                {columnas.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={
                      col.offresponsive
                        ? "off-responsive"
                        : col.onresponsive
                        ? "on-responsive"
                        : ""
                    }
                  >
                    {col.render
                      ? col.render(item[col.campo], item)
                      : item[col.campo]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaColeccion;
