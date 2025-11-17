import { agregar, modificar, altaBaja } from "../../../functions/dbFunctions";

export const buildCollectionHook = (coleccion, contextData, loading) => {
  return {
    data: contextData,
    loading,
    add: (nuevoDoc, idPersonalizado = null) =>
      agregar(coleccion, nuevoDoc, idPersonalizado),

    update: (id, datos) =>
      modificar(coleccion, id, datos),

    toggleEstado: (id, empresa = null, tipo = true) =>
      altaBaja(coleccion, id, empresa, tipo),
  };
};
