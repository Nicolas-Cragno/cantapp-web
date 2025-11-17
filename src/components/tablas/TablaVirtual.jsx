import React from "react";
import { FixedSizeList as List } from "react-window";
import "./css/Tables.css";

const TablaVirtual = ({ data, columnas, alto = 400, rowHeight = 45 }) => {
  const Row = ({ index, style }) => {
    const item = data[index];
    return (
      <tr
        className="table-item"
        style={{ ...style, display: "flex", width: "100%" }}
      >
        {columnas.map((col, i) => (
          <td
            key={i}
            className={col.offresponsive ? "off-responsive" : "on-responsive"}
            style={{ flex: col.flex ?? 1 }}
          >
            {col.render ? col.render(item[col.campo], item) : item[col.campo]}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="table-scroll-wrapper">
      <table className="table-lista">
        <thead>
          <tr className="table-titles" style={{ display: "flex", width: "100%" }}>
            {columnas.map((col, i) => (
              <th
                key={i}
                className={col.offresponsive ? "off-responsive" : "on-responsive"}
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
          itemCount={data.length}
          itemSize={rowHeight}
          width="100%"
        >
          {Row}
        </List>
      </div>
    </div>
  );
};

export default TablaVirtual;
