import { IProyecto } from "interfaces/proyecto.interface";
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";

export const generarTablaProyectosHTML = (proyectos: IProyecto[]) => {
    const parseValue = (val: any) => (val === null || val === undefined ? 'nulo' : val);

    const rows = proyectos.map((proyecto, index) => `
        <tr>
        <td>${index + 1}</td>
        <td>${parseValue(proyecto.name)}</td>
        <td>${parseValue(proyecto.type)}</td>
        <td>${parseValue(proyecto.fechaProyecto)}</td>
        <td>${parseValue(proyecto.BPIM)}</td>
        <td>${parseValue(proyecto.amount_subproject)}</td>
        <td>${parseValue(proyecto.contract_number)}</td>
        <td>$${parseValue(formatNumberWithSuffix(+proyecto.value_project))}</td>
        <td>${parseValue(proyecto.state_name)}</td>
        <td>${parseValue(proyecto.list_sector_name)}</td>
        <td>${parseValue(proyecto.municipios_texto)}</td>
        <td>${parseValue(proyecto.financial_current)}</td>
        <td>${parseValue(proyecto.physical_current)}</td>
        </tr>
    `).join('');

    return `
        <html>
        <head>
            <style>
            body {
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                padding: 20px;
                background: #fff;
                color: #333;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                border: 1px solid #ccc;
                padding: 6px 8px;
                text-align: center;
            }
            th {
                background-color: #f0f0f0;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #fafafa;
            }
            </style>
        </head>
        <body>
            <h2>Listado de Proyectos</h2>
            <table>
            <thead>
                <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Fecha Proyecto</th>
                <th>BPIM</th>
                <th>Subproyectos</th>
                <th>No. Contrato</th>
                <th>Valor Proyecto</th>
                <th>Nombre Estado</th>
                <th>Nombre Sector</th>
                <th>Texto Municipios</th>
                <th>Financiero Actual (%)</th>
                <th>Físico Actual (%)</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
            </table>
        </body>
        </html>
    `;
};
