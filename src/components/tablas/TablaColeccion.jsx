import "./css/Tables.css";

const TablaColeccion = ({ columnas, datos, onRowClick }) => {
  return (
    <div className="table-scroll-wrapper">
      <table className="table-lista">
        <thead className="table-titles">
          <tr>
            {columnas.map((col, index) => (
              <th key={index}>{col.titulo}</th>
            ))}
          </tr>
        </thead>
      </table>
      <div className="table-body-wrapper">
        <table className="table-lista">
          <tbody className="table-body">
            {datos.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                className="table-item"
              >
                {columnas.map((col, index) => (
                  <td key={index}>
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
