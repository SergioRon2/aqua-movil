import { srcImg } from 'assets/exportable/logo';
import { formatNumberWithSuffix } from 'utils/formatNumberWithSuffix';

interface ProyectoGeneral {
  fechaInicio: string | undefined;
  fechaFin: string | undefined;
  valorTotal: string;
  valorEjecutado: string;
}

interface ProyectoSector {
  amount_project: number;
  sector_id: number;
  sector_name: string;
}

export const generarReporteDashboardHTML = async (
  infoGeneral: ProyectoGeneral,
  sectores: ProyectoSector[],
  indicadores: any
) => {
  const fechaExportacion = new Date().toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Cards para sectores con color según índice, para darle dinamismo
  const coloresSector = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#E91E63"];
  const renderSectores = sectores
    .map(
      (sector, idx) => `
    <div class="card sector-card" style="border-left: 6px solid ${coloresSector[idx % coloresSector.length]}">
      <h4>${sector.sector_name}</h4>
      <p><strong>Total Proyectos:</strong> ${sector.amount_project}</p>
    </div>
  `
    )
    .join("");

  // Cards para indicadores con barras de progreso y color dinámico
  const renderIndicadores = Object.values(indicadores)
    .map(
      (item: any) => {
        const valor = +item.value || 0;
        const colorBar = valor >= 75 ? "#4CAF50" : valor >= 50 ? "#FFC107" : "#F44336";
        return `
        <div class="card indicador-card">
          <h4>${item.name}</h4>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${valor}%; background-color: ${colorBar};"></div>
          </div>
          <p>${valor}%</p>
        </div>
      `;
      }
    )
    .join("");

  // % ejecutado calculado bonito
  const porcentajeEjecutado =
    (+infoGeneral.valorEjecutado / +infoGeneral.valorTotal || 0) * 100;

  return `
    <html>
      <head>
        <style>
          /* Reset y base */
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #fff;
            color: #333;
            display: flex;
            margin: auto;
            padding: 20px;
          }

          h2 {
            text-align: center;
            margin-bottom: 0;
          }

          .header {
            color: black;
            border-radius: 8px;
            margin-bottom: 10px;
            font-weight: 700;
            font-size: 1.2rem;
            opacity: 0.6;
          }

          .fecha-exportacion {
            text-align: left;
            font-size: 0.85rem;
            color: #333;
            margin-top: 5px;
          }

          /* Contenedor general con grid */
          .dashboard-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }

          /* Card base */
          .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
            padding: 10px;
            transition: transform 0.2s ease;
          }

          .card:hover {
            transform: translateY(-6px);
            box-shadow: 0 8px 20px rgb(0 0 0 / 0.15);
          }

          /* Información General */
          .info-general {
            grid-column: 1 / -1;
            display: flex;
            justify-content: space-around;
            gap: 15px;
            flex-wrap: wrap;
            margin-top: 20px;
          }

          .info-card {
            flex: 1 1 200px;
            border-left: 6px solid #1976d2;
          }

          .info-card h3 {
            margin-top: 0;
            font-size: 1.1rem;
            margin-bottom: 8px;
          }

          .info-card p {
            font-size: 1.4rem;
            font-weight: 700;
            margin: 0;
            color: #1976d2;
          }

          /* Sectores */
          .sector-card {
            border-left-width: 6px;
          }

          .sector-card h4 {
            margin: 0 0 10px 0;
            font-weight: 600;
            font-size: 1.2rem;
          }

          .sector-card p {
            margin: 0;
            font-size: 1rem;
          }

          /* Indicadores */
          .indicador-card h4 {
            margin: 0 0 6px 0;
          }

          .progress-bar-container {
            background: #ddd;
            border-radius: 10px;
            overflow: hidden;
            height: 18px;
            margin-bottom: 6px;
          }

          .progress-bar {
            height: 100%;
            border-radius: 10px;
          }

          /* Footer */
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 0.8rem;
            color: #666;
          }

          /* Responsive tweaks */
          @media (max-width: 600px) {
            .info-general {
              flex-direction: column;
              align-items: center;
            }
          }
        </style>
      </head>
      <body style="display: flex; gap: 10px; flex-direction: column;">
        <div class="header">
          <img src="${srcImg}" alt="Logo" style="height:120px;vertical-align:middle;margin-right:12px;" />
          <div class="fecha-exportacion">Exportado: ${fechaExportacion}</div>
        </div>

        <section>
          <h2>1. Información General</h2>
          <div class="info-general">
            <div class="card info-card">
              <h3>Fecha de Inicio</h3>
              <p>${infoGeneral.fechaInicio || "-"}</p>
            </div>
            <div class="card info-card">
              <h3>Fecha de Finalización</h3>
              <p>${infoGeneral.fechaFin || "-"}</p>
            </div>
            <div class="card info-card">
              <h3>Valor Total</h3>
              <p>$${formatNumberWithSuffix(+infoGeneral.valorTotal)}</p>
            </div>
            <div class="card info-card">
              <h3>Valor Ejecutado</h3>
              <p>$${formatNumberWithSuffix(+infoGeneral.valorEjecutado)}</p>
            </div>
            <div class="card info-card">
              <h3>% Ejecutado</h3>
              <p>${porcentajeEjecutado.toFixed(1)}%</p>
            </div>
          </div>
        </section>

        <section>
          <h2>2. Proyectos por Sector</h2>
          <div class="dashboard-container">
            ${renderSectores}
          </div>
        </section>

        <section>
          <h2>3. Indicadores de Ejecución</h2>
          <div class="dashboard-container">
            ${renderIndicadores}
          </div>
        </section>
      </body>
    </html>
  `;
};

