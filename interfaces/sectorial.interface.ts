export interface ISectorial {
    id: number;
    sectorial: string;
    proyectos: {
        total: number;
        ejecutados: number;
        lista: IProyectosSectorial[];
    };
    iniciativas: string;
    valor: string;
    valorEjecutado: string;
}

export interface IProyectosSectorial {
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
    contrato: string;
    estado: string;
    contratista: string;
    sectorial: string;
    municipio: string;
    valor: string;
}