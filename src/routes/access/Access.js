export const Access = {
    // En desarrollo
    "/taller-tractores": ["dev"],      // taller tractores
    "/control-combustible": ["dev"],   // trafico / combustible
    "/stock": ["dev"],                 // talleres

    // Solo administradores
    "/personal": ["admin"],
    "/mecanicos": ["admin"],
    "/choferes-larga": ["admin"],
    "/choferes-movimiento": ["admin"],
    "/flota": ["admin"],
    "/tractores": ["admin"],
    "/furgones": ["admin"],
    "/utilitarios": ["admin"],

    // Usuarios
    "/actividad": ["user", "admin"],   // satelital
    "/porteria": ["user", "admin"],    // seguridad / porteria

    // Todos
    "/": ["user", "admin", "dev"],
}