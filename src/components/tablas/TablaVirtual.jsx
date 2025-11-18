import React from "react";
import { FixedSizeList as List } from "react-window";
import "./css/Tables.css";

const TablaVirtual = ({ data = [], columnas, alto = 400, onRowClick}) => {
  const lista = Array.isArray(data) ? data : [];

  const Row = ({ index, style }) => {
    const item = lista[index] ?? {};
    return (
      <div
        className="table-item"
        style={{ 
          ...style,
          display: "flex",
          width: "100%"
        }}
        onClick={()=>onRowClick && onRowClick(item, index)}
      >
        {columnas.map((col, i) => (
          <div
            key={i}
            className={col.offresponsive ? "off-responsive" : col.onresponsive ? "on-responsive" : ""}
            style={{ flex: col.flex ?? 1, padding: "8px" }}
          >
            {col.render ? col.render(item[col.campo], item) : item[col.campo] ?? ""}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="table-scroll-wrapper">
      <table className="table-lista">
        <thead>
          <tr 
            className="table-titles"
            style={{ display: "flex", width: "100%" }}
          >
            {columnas.map((col, i) => (
              <th
                key={i}
                className={col.offresponsive ? "off-responsive" : col.onresponsive ? "on-responsive" : ""}
                style={{ flex: col.flex ?? 1 }}
              >
                {col.titulo}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <div className="table-body-wrapper">
        <List
          height={alto}
          itemCount={lista.length}
          itemSize={100}
          width="100%"
        >
          {Row}
        </List>
      </div>
    </div>
  );
};

export default TablaVirtual;
