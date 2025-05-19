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

  const renderMunicipioRow = (item: any, index: number) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.nombre}</td>
      <td>${item.amount_project_initiatives ?? 0}</td>
      <td>${item.amount_initiatives ?? 0}</td>
      <td>${item.value_total_project ?? 0}</td>
      <td>${(item.value_total_project > 0 ? item.value_total_executed / item.value_total_project : 0).toFixed(0)}%</td>
    </tr>
  `;

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
        <style>
          body { font-family: Arial; padding: 20px; color: #222; background: #f7f7f7; }
          table { width: 100%; border-collapse: collapse; background: #fff; }
          th, td { border: 1px solid #bbb; padding: 8px; text-align: left; }
          th { background: #e0e0e0; color: #333; }
          .excel-header { background: #aaa; color: #fff; font-weight: bold; padding: 12px; margin-bottom: 0; }
        </style>
      </head>
      <body>
        <div class="excel-header">
          Reporte de Municipios<br/>
          Exportado: ${fechaExportacion}
        </div>
        <table style="margin-top:0;">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Proyectos</th>
              <th>Iniciativas</th>
              <th>Valor</th>
              <th>Progreso</th>
            </tr>
          </thead>
          <tbody>
            ${listaConInfo.map(renderMunicipioRow).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
};
