export const Access = {
    // En desarrollo ["dev"]
    "/combustible": ["dev"],

    
    // Solo administradores ["admin", "dev"]
    "/recursos": ["admin", "superadmin", "dev"],
    "/stock": ["admin", "superadmin","dev"],                 // talleres
    
    // Usuarios / administradores ["user", "admin","dev"]
    "/porteria": ["user", "admin", "superadmin","dev"],    // seguridad / porteria
    "/tractores" : ["user", "admin", "superadmin", "dev"], // taller tractores
    "/furgones" : ["user", "admin", "superadmin", "dev"],
    
    // Todos
    "/": ["user", "admin", "superadmin", "dev"],
    "/perfil": ["user", "admin", "superadmin", "dev"],

}