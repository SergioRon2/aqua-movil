export interface IProyecto {
    id: string;
    name: string;
    type: string;
    fechaProyecto: string;
    state_code: string;
    state_name: string;
    state_color: string;
    list_sector_code: string;
    list_sector_name: string;
    created_at: string;
    municipios_count: number;
    municipios_texto: string | null;
    total_source_value: number | null;
    total_progreso: number;
    projectBankDate: string;
    financial_delay: number;
    financial_current: number;
    physical_delay: number;
    physical_current: number;
}
