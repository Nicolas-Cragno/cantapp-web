export const Access = {
    // En desarrollo ["dev"]
    
    
    // Solo administradores ["admin", "dev"]
    "/recursos": ["admin", "dev"],
    "/stock": ["admin","dev"],                 // talleres
    
    // Usuarios / administradores ["user", "admin","dev"]
    "/porteria": ["user", "admin","dev"],    // seguridad / porteria
    "/satelital" : ["user", "admin","dev"], // satelital
    "/tractores" : ["user", "admin", "dev"], // taller tractores
    
    // Todos
    "/": ["user", "admin", "dev"],
    "/perfil": ["user", "admin", "dev"],

}