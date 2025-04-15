export interface IMunicipio {
    id: number;
    municipio: string;
    proyectos: {
        total: number;
        ejecutados: number;
        lista: IProyectos[];
    };	
    iniciativas: string;
    valor: string;
    valorEjecutado: string;
}

export interface IProyectos {
    id: string;
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