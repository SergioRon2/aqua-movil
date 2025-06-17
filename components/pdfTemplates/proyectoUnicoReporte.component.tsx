import { srcImg } from "assets/exportable/logo";
import { IProyecto } from "interfaces/proyecto.interface";
import { capitalize } from "utils/capitalize";
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";

export const generarReporteProyectoHTML = (proyecto: any, subProjectsLength?: number, infoProyecto?: any, avances?: any) => {
    const parseValue = (val: any) => (val === null || val === undefined || val === "" ? 'Nulo' : val);

    const buildCard = (label: string, value: string, colorClass: string, icon?: string) => `
        <div class="card ${colorClass}">
            ${icon ? `<span class="icon">${icon}</span>` : ""}
            <span class="label">${label}</span>
            <span class="value">${value}</span>
        </div>
    `;

    console.log(infoProyecto?.contract_principal?.contract_number)

    const fechaExportacion = new Date().toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

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
        <div className="">
          <img src="${srcImg}" alt="Logo" style="height:120px;vertical-align:middle;margin-right:12px;opacity:0.7;" />
          <div class="fecha-exportacion">Exportado: ${fechaExportacion}</div>
        </div>
        <h2 style="text-align:left;">📋 Reporte del Proyecto</h2>
        <div class="grid">
          ${buildCard("Nombre", parseValue(proyecto.name || proyecto.title), "blue", "📌")}
          ${buildCard("Fecha inicio", parseValue(proyecto.fechaProyecto || proyecto.start_actSigning_date), "orange", "📅")}
          ${buildCard("Fecha fin", parseValue(proyecto.fechaProyecto || proyecto.date_end_all), "orange", "📅")}
          ${buildCard("Contrato", parseValue(capitalize(proyecto.type) || proyecto.id), "grey", "📃")}
          ${buildCard("Estado", parseValue(proyecto.state_name || proyecto.state), "red", "⚠️")}
          ${buildCard("Sectorial", parseValue(proyecto.list_sector_name || proyecto.sector), "blue", "🏛️")}
          ${buildCard("Municipio", parseValue(proyecto.municipios_texto), "blue", "🌍")}
          ${buildCard("Contratista", parseValue(proyecto.BPIM), "grey", "🏗️")}
          ${buildCard("Valor del proyecto", proyecto.total_source_value || proyecto.project_value != null
            ? `$${formatNumberWithSuffix(+proyecto.total_source_value || +proyecto.value_init_project)}`
            : 'Nulo', "purple", "💰")}
          ${buildCard("Número de contrato", parseValue(proyecto.contract_number), "grey", "🔢")}
          ${subProjectsLength && subProjectsLength > 0
            ? buildCard("Subproyectos", subProjectsLength.toString(), "blue", "🧩")
            : ''}
          ${buildCard("Avance físico", parseValue(avances.avanceFisico.value) + "%", "green", "🏃‍♂️")}
          ${buildCard("Avance financiero", parseValue(avances.avanceFinanciero.value) + "%", "green", "💵")}
        </div>
      </body>
    </html>
  `;
};
