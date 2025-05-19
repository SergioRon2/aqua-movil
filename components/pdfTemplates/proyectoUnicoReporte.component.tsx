import { IProyecto } from "interfaces/proyecto.interface";
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";

export const generarReporteProyectoHTML = (proyecto: IProyecto, subProjectsLength?: number) => {
    const parseValue = (val: any) => (val === null || val === undefined || val === "" ? 'Nulo' : val);

    return `
        <html>
        <head>
            <meta charset="UTF-8" />
            <style>
                body {
                    padding: 16px;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                    font-family: 'Arial', sans-serif;
                    font-size: 14px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                    color: #333;
                }
                .color {
                    color: #333;
                }
            </style>
        </head>
        <body>
            <h2>Reporte del Proyecto</h2>
            <table>
                <tr>
                    <th>Campo</th>
                    <th>Valor</th>
                </tr>
                <tr>
                    <td>Nombre</td>
                    <td>${parseValue(proyecto.name)}</td>
                </tr>
                <tr>
                    <td>Fecha inicio</td>
                    <td>${parseValue(proyecto.fechaProyecto)}</td>
                </tr>
                <tr>
                    <td>Fecha fin</td>
                    <td>${parseValue(proyecto.fechaProyecto)}</td>
                </tr>
                <tr>
                    <td>Contrato</td>
                    <td>${parseValue(proyecto.type)}</td>
                </tr>
                <tr>
                    <td>Estado</td>
                    <td class="color">${parseValue(proyecto.state_name)}</td>
                </tr>
                <tr>
                    <td>Sectorial</td>
                    <td>${parseValue(proyecto.list_sector_name)}</td>
                </tr>
                <tr>
                    <td>Municipio</td>
                    <td>${parseValue(proyecto.municipios_texto)}</td>
                </tr>
                <tr>
                    <td>Contratista</td>
                    <td>${parseValue(proyecto.BPIM)}</td>
                </tr>
                <tr>
                    <td>Valor del proyecto</td>
                    <td>${proyecto.total_source_value != null
                        ? `$${formatNumberWithSuffix(+proyecto.total_source_value)}`
                        : 'Nulo'}</td>
                </tr>
                <tr>
                    <td>Número de contrato</td>
                    <td>${parseValue(proyecto.contract_number)}</td>
                </tr>
                ${subProjectsLength && subProjectsLength > 0 ? `
                    <tr>
                        <td>Subproyectos</td>
                        <td>${subProjectsLength}</td>
                    </tr>
                ` : ''}
                <tr>
                    <td>Avance físico</td>
                    <td>${parseValue(proyecto.physical_current)}</td>
                </tr>
                <tr>
                    <td>Avance financiero</td>
                    <td>${parseValue(proyecto.financial_current)}</td>
                </tr>
            </table>
        </body>
        </html>
    `;
};
