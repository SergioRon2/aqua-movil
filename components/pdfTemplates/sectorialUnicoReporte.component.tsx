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

export const generarResumenSectorialUnicoHTML = (
  titulo: string,
  proyectos: IProyecto[],
  avances: Avances
) => {
  const fechaExportacion = new Date().toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const colores = [
    "#f44336", "#e91e63", "#9c27b0", "#3f51b5", "#2196f3",
    "#00bcd4", "#009688", "#4caf50", "#ff9800", "#795548",
  ];

  const getRandomColor = () => colores[Math.floor(Math.random() * colores.length)];

  const indicadores = [
    { ...avances.avanceFinanciero },
    { ...avances.avanceFisico },
    { ...avances.indicadorTiempo },
    { name: "Total de Proyectos", value: proyectos?.length },
  ];

  const renderCard = (item: Avance, index: number) => {
    const color = getRandomColor();
    return `
      <div class="card" style="--main-color: ${color};">
        <h2>${item.name}</h2>
        <p>${item.value}${index < 3 ? "%" : ""}</p>
      </div>
    `;
  };

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
            background-color: white;
            border-left: 6px solid var(--main-color);
            border-radius: 16px;
            padding: 24px 32px;
            width: 260px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.2s ease-in-out;
          }

          .card:hover {
            transform: scale(1.03);
          }

          .card h2 {
            margin: 0;
            font-size: 18px;
            color: var(--main-color);
            margin-bottom: 12px;
          }

          .card p {
            margin: 0;
            font-size: 26px;
            font-weight: bold;
            color: var(--main-color);
          }

          .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 14px;
            color: #888;
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

          .proyecto-header {
            padding: 14px 20px;
            font-size: 17px;
            font-weight: 600;
            background: var(--card-color);
            color: #fff;
          }

          .proyecto-body {
            padding: 16px 20px 18px 20px;
            color: #333;
          }

          .proyecto-body > div {
            margin-bottom: 7px;
          }
        </style>
      </head>
      <body>
        <img src="${srcImg}" alt="Logo" style="height:120px;vertical-align:middle;margin-right:12px;opacity:0.7;" />
        <h1>${titulo}</h1>
        <div class="subtitulo">Exportado: ${fechaExportacion}</div>

        <div class="cards-container">
          ${indicadores.map(renderCard).join("")}
        </div>

        <h2 style="margin-top:40px;color:#1a237e;">Lista de Proyectos</h2>
        <div class="proyectos-container">
          ${proyectos.map(renderProyecto).join("")}
        </div>

        <div class="footer">Datos generados automáticamente</div>
      </body>
    </html>
  `;
};
