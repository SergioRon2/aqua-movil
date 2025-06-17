export const sanitizarNombreArchivo = (nombre: string): string => {
    return nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_\-]/g, "_")
        .slice(0, 50);
};