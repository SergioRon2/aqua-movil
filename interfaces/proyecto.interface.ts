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
