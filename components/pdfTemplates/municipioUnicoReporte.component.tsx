import { srcImg } from "assets/exportable/logo";
import { IProyecto } from "interfaces/proyecto.interface";
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";

interface Avance {
  name: string;
  value: number;
}

interface Avances {
  avanceFinanciero: Avance;
  avanceFisico: Avance;
  indicadorTiempo: Avance;
}

const getColorByValue = (value: number) => {
  if (value >= 80) return '#388e3c'; // verde
  if (value >= 50) return '#f9a825'; // amarillo
  return '#d32f2f'; // rojo
};

const getBackgroundByValue = (value: number) => {
  if (value >= 80) return '#e8f5e9'; // verde claro
  if (value >= 50) return '#fffde7'; // amarillo claro
  return '#ffebee'; // rojo claro
};

export const generarResumenMunicipioUnicoHTML = (
  nombreMunicipio: string,
  proyectos: IProyecto[],
  avances: Avances
) => {
  const fechaExportacion = new Date().toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const renderCard = (avance: Avance) => {
    const color = getColorByValue(avance.value);
    const background = getBackgroundByValue(avance.value);

    return `
      <div class="card" style="background-color: ${background}; color: ${color};">
        <h2>${avance.name}</h2>
        <p>${avance.value}%</p>
      </div>
    `;
  };
  const colores = [
    "#f44336", "#e91e63", "#9c27b0", "#3f51b5", "#2196f3",
    "#00bcd4", "#009688", "#4caf50", "#ff9800", "#795548",
  ];
  const getRandomColor = () => colores[Math.floor(Math.random() * colores.length)];
  const parseValue = (val: any) => (val === null || val === undefined ? 'nulo' : val);

  const renderProyecto = (proyecto: IProyecto, index: number) => {
    const color = getRandomColor();
    // Generar dinámicamente las filas de atributos del proyecto con más estilo
    const atributos = [
      { label: "Tipo", value: proyecto.type },
      { label: "Fecha Proyecto", value: proyecto.fechaProyecto },
      { label: "BPIM", value: proyecto.BPIM },
      { label: "Subproyectos", value: proyecto.amount_subproject },
      { label: "No. Contrato", value: proyecto.contract_number },
      { label: "Valor Proyecto", value: proyecto.value_project ? `$${formatNumberWithSuffix(+proyecto.value_project)}` : null },
      { label: "Estado", value: proyecto.state_name },
      { label: "Sector", value: proyecto.list_sector_name },
      { label: "Municipios", value: proyecto.municipios_texto },
    ].filter(attr => attr.value !== undefined && attr.value !== null);

    // Indicadores dinámicos
    const indicadores = [
      proyecto.financial_current !== undefined && proyecto.financial_current !== null
        ? `<span class="pill pill-financiero">💰 ${parseValue(proyecto.financial_current)}%</span>` : "",
      proyecto.physical_current !== undefined && proyecto.physical_current !== null
        ? `<span class="pill pill-fisico">🏗️ ${parseValue(proyecto.physical_current)}%</span>` : "",
    ].filter(Boolean).join(" ");

    return `
        <div class="proyecto-card" style="--card-color: ${color}; border-top: 5px solid ${color}; box-shadow: 0 6px 18px rgba(0,0,0,0.13);">
        <div class="proyecto-header" style="background: ${color}; color: #fff; letter-spacing: 1px; border-radius: 8px;">
          <span style="font-size:20px; font-weight:700;">#${index + 1}</span> - ${parseValue(proyecto.name)}
        </div>
        <div class="proyecto-body" style="padding-top:18px;">
          <table style="width:100%; border-collapse:collapse;">
          <tbody>
            ${atributos.map(attr => `
            <tr>
              <td style="padding:4px 8px; color:#555; font-weight:500; width: 40%;">${attr.label}:</td>
              <td style="padding:4px 8px; color:#222; background:#f7f8fa; border-radius:4px;">${parseValue(attr.value)}</td>
            </tr>
            `).join("")}
          </tbody>
          </table>
          ${indicadores ? `<div class="indicadores" style="margin-top:14px; display:flex; gap:10px;">${indicadores}</div>` : ""}
        </div>
        </div>
      `;
  };

  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 40px;
            color: #333;
          }

          h1 {
            text-align: center;
            color: #1a237e;
            margin-bottom: 10px;
          }

          .subtitulo {
            text-align: center;
            font-size: 14px;
            color: #555;
            margin-bottom: 40px;
          }

          .cards-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
          }

          .card {
            border-radius: 16px;
            padding: 24px 32px;
            width: 280px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.2s ease-in-out;
          }

          .card:hover {
            transform: translateY(-5px);
          }

          .card h2 {
            margin: 0;
            font-size: 18px;
            margin-bottom: 12px;
          }

          .card p {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }

          .card.total {
            background-color: #e3f2fd;
            color: #1565c0;
          }

          .proyectos-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
          }

          .proyecto-card {
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            padding: 16px;
            min-width: 280px;
            max-width: 340px;
            flex: 1 1 300px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          @media print {
            .proyectos-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 20px;
            }

            .proyecto-card {
              break-inside: avoid-page;
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }

          .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 14px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${srcImg}" alt="Logo" style="height:120px;vertical-align:middle;margin-right:12px;opacity:0.7;" />
        </div>
        <h1>Resumen general de ${nombreMunicipio}</h1>
        <div class="subtitulo">Exportado: ${fechaExportacion}</div>

        <div class="cards-container">
          ${renderCard(avances.avanceFinanciero)}
          ${renderCard(avances.avanceFisico)}
          ${renderCard(avances.indicadorTiempo)}

          <div class="card total">
            <h2>Total de Proyectos</h2>
            <p>${proyectos?.length}</p>
          </div>
        </div>

        <div class="proyectos-container">
          <div style="width:100%;text-align:center;font-size:20px;font-weight:600;color:#1a237e;margin:32px 0 18px 0;letter-spacing:1px;">
            <h2 style="margin-top:40px;color:#1a237e;">Lista de Proyectos e Iniciativas</h2>
          </div>
          ${proyectos.map(renderProyecto).join("")}
        </div>

        <div class="footer">Datos generados automáticamente</div>
      </body>
    </html>
  `;
};
