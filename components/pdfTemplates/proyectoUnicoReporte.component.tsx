import { IProyecto } from "interfaces/proyecto.interface";
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";

export const generarReporteProyectoHTML = (proyecto: IProyecto, subProjectsLength?: number) => {
    const parseValue = (val: any) => (val === null || val === undefined || val === "" ? 'Nulo' : val);

    const buildCard = (label: string, value: string, colorClass: string, icon?: string) => `
        <div class="card ${colorClass}">
            ${icon ? `<span class="icon">${icon}</span>` : ""}
            <span class="label">${label}</span>
            <span class="value">${value}</span>
        </div>
    `;

    return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            padding: 30px;
            font-family: 'Segoe UI', sans-serif;
            background-color: #f5f7fa;
            color: #333;
          }

          h2 {
            text-align: center;
            color: #1a237e;
            margin-bottom: 30px;
          }

          .grid {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
          }

          .card {
            border-radius: 12px;
            padding: 16px;
            min-width: 220px;
            max-width: 300px;
            flex: 1 1 220px;
            display: flex;
            flex-direction: column;
            background: #fff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
            border: 2px solid transparent;
          }

          .icon {
            font-size: 20px;
            color: #ccc;
            position: absolute;
            top: 12px;
            right: 12px;
          }

          .label {
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 4px;
            opacity: 0.8;
          }

          .value {
            font-size: 16px;
            font-weight: bold;
          }

          /* Colores como bordes + texto */
          .blue {
            border-color: #1e88e5;
            color: #000;
          }
          .green {
            border-color: #43a047;
            color: #000;
          }
          .orange {
            border-color: #fb8c00;
            color: #000;
          }
          .red {
            border-color: #e53935;
            color: #000;
          }
          .purple {
            border-color: #8e24aa;
            color: #000;
          }
          .grey {
            border-color: #546e7a;
            color: #000;
          }

          @media print {
            .grid {
              page-break-inside: avoid;
            }
            .card {
              break-inside: avoid;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <h2>📋 Reporte del Proyecto</h2>
        <div class="grid">
          ${buildCard("Nombre", parseValue(proyecto.name), "blue", "📌")}
          ${buildCard("Fecha inicio", parseValue(proyecto.fechaProyecto), "orange", "📅")}
          ${buildCard("Fecha fin", parseValue(proyecto.fechaProyecto), "orange", "📅")}
          ${buildCard("Contrato", parseValue(proyecto.type), "grey", "📃")}
          ${buildCard("Estado", parseValue(proyecto.state_name), "red", "⚠️")}
          ${buildCard("Sectorial", parseValue(proyecto.list_sector_name), "blue", "🏛️")}
          ${buildCard("Municipio", parseValue(proyecto.municipios_texto), "blue", "🌍")}
          ${buildCard("Contratista", parseValue(proyecto.BPIM), "grey", "🏗️")}
          ${buildCard("Valor del proyecto", proyecto.total_source_value != null
            ? `$${formatNumberWithSuffix(+proyecto.total_source_value)}`
            : 'Nulo', "purple", "💰")}
          ${buildCard("Número de contrato", parseValue(proyecto.contract_number), "grey", "🔢")}
          ${subProjectsLength && subProjectsLength > 0
            ? buildCard("Subproyectos", subProjectsLength.toString(), "blue", "🧩")
            : ''}
          ${buildCard("Avance físico", parseValue(proyecto.physical_current) + "%", "green", "🏃‍♂️")}
          ${buildCard("Avance financiero", parseValue(proyecto.financial_current) + "%", "green", "💵")}
        </div>
      </body>
    </html>
  `;
};
