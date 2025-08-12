export const Access = {
    // En desarrollo
    "/taller-tractores": ["dev"],      // taller tractores
    "/taller-furgones": ["dev"],       // taller furgones
    "/control-combustible": ["dev"],   // trafico / combustible
    
    // Solo administradores
    "/personal": ["admin","dev"],
    "/mecanicos": ["admin","dev"],
    "/choferes-larga": ["admin","dev"],
    "/choferes-movimiento": ["admin","dev"],
    "/flota": ["admin","dev"],
    "/tractores": ["admin","dev"],
    "/furgones": ["admin","dev"],
    "/utilitarios": ["admin","dev"],
    "/stock": ["admin","dev"],                 // talleres

    // Usuarios / administradores
    "/actividad": ["user", "admin","dev"],   // todos
    "/porteria": ["user", "admin","dev"],    // seguridad / porteria
    "/satelital" : ["user", "admin","dev"], // satelital

    // Todos
    "/": ["user", "admin", "dev"],
    "/perfil": ["user", "admin", "dev"],
}