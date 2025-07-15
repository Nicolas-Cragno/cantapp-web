import empresas from "./data/empresas.json";

export function nombreEmpresa(cuit) {
    return empresas[cuit] || "SIN ASIGNAR";
}