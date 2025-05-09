export interface IProyecto {
    id: string;
    name: string;
    type: string;
    fechaProyecto: string;
    BPIM: string;
    amount_subproject: number;
    contract_number: string;
    value_project: string;
    state_code: string;
    state_name: string;
    state_color: string;
    list_sector_code: string | null;
    list_sector_name: string | null;
    created_at: string;
    municipios_count: number;
    municipios_texto: string | null;
    total_source_value: number | string | null;
    total_progreso: number;
    projectBankDate: string;
    financial_delay: number;
    financial_current: number | null;
    physical_delay: number | null;
    physical_current: number | null;
}


export interface IProyectoDashboard {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    title_show: string;
    project_name: string;
    municipio_name: string;
    departamento_name: string;
    value_init_project: string;
    project_value: string;      
    population: number;
    list_contract: any[];
    development_plan: string;
    sector: string;
    start_actSigning_date: string | null;
    value_exec: number;
    value_per_payment: number;
    state: string | null;
    amount_extension: number;
    amount_months_extension: number;
    date_end_all: string;
    term_end: number;
    time_exec: number;
}
