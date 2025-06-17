import { srcImg } from "assets/exportable/logo";
import { IMunicipio } from "interfaces/municipio.interface";
import { StateService } from "services/states/states.service";

export const generarReporteMunicipiosHTML = async (
  listaMunicipios: IMunicipio[],
  fechaInicio: string,
  fechaFin: string
) => {
  const listaConInfo = await Promise.all(
    listaMunicipios.map(async (municipio) => {
      const municipioInfo = await StateService.getStatesData({
        municipio_id: municipio.id,
        fechaInicio,
        fechaFin,
      });

      return {
        ...municipio,
        ...(municipioInfo?.data || {}),
      };
    })
  );

  const colores = [
    '#f44336', // rojo
    '#e91e63', // rosado
    '#9c27b0', // púrpura
    '#3f51b5', // azul
    '#2196f3', // celeste
    '#00bcd4', // cyan
    '#009688', // teal
    '#4caf50', // verde
    '#ff9800', // naranja
    '#795548', // marrón
  ];

  const getRandomColor = () => colores[Math.floor(Math.random() * colores.length)];

  const renderCard = (item: any, index: number) => {
    const progreso =
      item.value_total_project > 0
        ? (item.value_total_executed / item.value_total_project) * 100
        : 0;

    const borderColor = getRandomColor();

    return `
      <div class="card" style="border-color: ${borderColor};">
        <div class="card-header">
          <strong style="color: ${borderColor};">${index + 1}. ${item.name}</strong>
        </div>
        <div class="card-body">
          <p>📁 Proyectos: <strong>${item.amount_project_initiatives ?? 0}</strong></p>
          <p>📌 Iniciativas: <strong>${item.amount_initiatives ?? 0}</strong></p>
          <p>💰 Valor: <strong>$${item.value_total_project?.toLocaleString('es-CO') ?? 0}</strong></p>
          <p>📊 Progreso: <strong>${progreso.toFixed(0)}%</strong></p>
        </div>
      </div>
    `;
  };

  const fechaExportacion = new Date().toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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
            background: #fff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            border: 2px solid transparent;
          }

          .card-header {
            font-size: 16px;
            margin-bottom: 12px;
            color: #222;
          }

          .card-body p {
            margin: 6px 0;
            font-size: 14px;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
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
        <div class="header">
          <img src="${srcImg}" alt="Logo" style="height:120px;vertical-align:middle;margin-right:12px;opacity:0.7;" />
        </div>
        <h2 style="text-align:left">📊 Reporte de Municipios</h2>
        <div class="grid">
          ${listaConInfo.map(renderCard).join("")}
        </div>
        <div class="footer">
          Exportado: ${fechaExportacion}
        </div>
      </body>
    </html>
  `;
};
