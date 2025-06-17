import { IProyecto } from "interfaces/proyecto.interface";

export const agruparPorLetra = (proyectos: IProyecto[]) => {
    const agrupados: Record<string, IProyecto[]> = {};
    proyectos.forEach((proyecto) => {
        const letra = proyecto.name?.[0]?.toUpperCase() || '#';
        if (!agrupados[letra]) agrupados[letra] = [];
        agrupados[letra].push(proyecto);
    });

    // Ordenar alfabéticamente
    return Object.keys(agrupados)
        .sort()
        .map((letra) => ({
            letra,
            data: agrupados[letra]
        }));
};