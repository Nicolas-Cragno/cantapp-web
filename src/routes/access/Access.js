export const Access = {
    // En desarrollo ["dev"]
    "/taller-tractores": ["dev"],      // taller tractores
    "/control-combustible": ["dev"],   // trafico / combustible
    "/actividad": ["dev"],   // todos
    "/taller-furgones": ["dev"],       // taller furgones
    
    
    // Solo administradores ["admin", "dev"]
    "/recursos": ["admin", "dev"],
    "/personal": ["admin","dev"],
    "/mecanicos": ["admin","dev"],
    "/choferes-larga": ["admin","dev"],
    "/choferes-movimiento": ["admin","dev"],
    "/flota": ["admin","dev"],
    "/tractores": ["admin","dev"],
    "/furgones": ["admin","dev"],
    "/utilitarios": ["admin","dev"],
    "/stock": ["admin","dev"],                 // talleres
    
    // Usuarios / administradores ["user", "admin","dev"]
    "/porteria": ["user", "admin","dev"],    // seguridad / porteria
    "/satelital" : ["user", "admin","dev"], // satelital
    
    // Todos
    "/": ["user", "admin", "dev"],
    "/perfil": ["user", "admin", "dev"],
}