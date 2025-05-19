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

  const renderSectores = sectores
    .map(
      (sector, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${sector.sector_name}</td>
      <td>${sector.amount_project}</td>
    </tr>
  `
    )
    .join("");

  const renderIndicadores = Object.values(indicadores)
  .map(
    (item: any) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.value}%</td>
      </tr>
    `
  )
  .join('');

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; color: #222; background: #f7f7f7; }
          table { width: 100%; border-collapse: collapse; background: #fff; margin-bottom: 40px; }
          th, td { border: 1px solid #bbb; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #e0e0e0; color: #333; }
          .excel-header { background: #aaa; color: #fff; font-weight: bold; padding: 12px; margin-bottom: 0; }
          h3 { margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="excel-header">
          Reporte General de Proyectos<br/>
          Exportado: ${fechaExportacion}
        </div>

        <h3>1. Información General</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Valor Total</th>
              <th>Valor Ejecutado</th>
              <th>% Ejecutado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${infoGeneral.fechaInicio}</td>
              <td>${infoGeneral.fechaFin}</td>
              <td>$${infoGeneral.valorTotal}</td>
              <td>$${infoGeneral.valorEjecutado}</td>
              <td>${(
                (+infoGeneral.valorEjecutado / +infoGeneral.valorTotal || 0) * 100
              ).toFixed(0)}%</td>
            </tr>
          </tbody>
        </table>

        <h3>2. Proyectos por Sector</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Sector</th>
              <th>Total Proyectos</th>
            </tr>
          </thead>
          <tbody>
            ${renderSectores}
          </tbody>
        </table>

        <h3>3. Indicadores de Ejecución</h3>
        <table>
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Valor (%)</th>
            </tr>
          </thead>
          <tbody>
            ${renderIndicadores}
          </tbody>
        </table>
      </body>
    </html>
  `;
};
