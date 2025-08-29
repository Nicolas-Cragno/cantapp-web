export const Access = {
    // En desarrollo
    "/taller-tractores": ["dev"],      // taller tractores
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
    "/taller-furgones": ["user", "admin", "dev"],       // taller furgones
    
    // Todos
    "/": ["user", "admin", "dev"],
    "/perfil": ["user", "admin", "dev"],
}