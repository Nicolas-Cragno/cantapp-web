export const Access = {
    // En desarrollo ["dev"]
    "/combustible": ["dev"],

    
    // Solo administradores ["admin", "dev"]
    "/recursos": ["admin", "dev"],
    "/stock": ["admin","dev"],                 // talleres
    
    // Usuarios / administradores ["user", "admin","dev"]
    "/porteria": ["user", "admin","dev"],    // seguridad / porteria
    "/tractores" : ["user", "admin", "dev"], // taller tractores
    "/furgones" : ["user", "admin", "dev"],
    
    // Todos
    "/": ["user", "admin", "dev"],
    "/perfil": ["user", "admin", "dev"],

}