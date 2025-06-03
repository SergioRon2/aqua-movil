import { IProyecto } from "interfaces/proyecto.interface";
import { formatNumberWithSuffix } from "utils/formatNumberWithSuffix";

export const generarTablaProyectosHTML = (proyectos: IProyecto[]) => {
  const parseValue = (val: any) => (val === null || val === undefined ? 'nulo' : val);

  const cards = proyectos.map((proyecto, index) => `
    <div class="card">
      <h3 class="card-title">#${index + 1} - ${parseValue(proyecto.name)}</h3>
      <div class="card-body">
        <p><strong>Tipo:</strong> ${parseValue(proyecto.type)}</p>
        <p><strong>Fecha Proyecto:</strong> ${parseValue(proyecto.fechaProyecto)}</p>
        <p><strong>BPIM:</strong> ${parseValue(proyecto.BPIM)}</p>
        <p><strong>Subproyectos:</strong> ${parseValue(proyecto.amount_subproject)}</p>
        <p><strong>No. Contrato:</strong> ${parseValue(proyecto.contract_number)}</p>
        <p><strong>Valor Proyecto:</strong> $${parseValue(formatNumberWithSuffix(+proyecto.value_project))}</p>
        <p><strong>Estado:</strong> ${parseValue(proyecto.state_name)}</p>
        <p><strong>Sector:</strong> ${parseValue(proyecto.list_sector_name)}</p>
        <p><strong>Municipios:</strong> ${parseValue(proyecto.municipios_texto)}</p>
        <div class="indicadores">
          <div class="pill pill-financiero">💰 ${parseValue(proyecto.financial_current)}%</div>
          <div class="pill pill-fisico">🏗️ ${parseValue(proyecto.physical_current)}%</div>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f7f9fc;
            padding: 30px;
            color: #333;
          }

          h2 {
            text-align: center;
            color: #1a237e;
            margin-bottom: 30px;
          }

          .container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
          }

          .card {
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
            transition: all 0.2s ease;
          }

          .card:hover {
            transform: translateY(-2px);
          }

          .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #0d47a1;
            margin-bottom: 10px;
          }

          .card-body p {
            margin: 4px 0;
            font-size: 13px;
            color: #444;
          }

          .indicadores {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            gap: 6px;
          }

          .pill {
            padding: 5px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: bold;
            color: white;
            text-align: center;
            flex: 1;
          }

          .pill-financiero {
            background-color: #43a047;
          }

          .pill-fisico {
            background-color: #1e88e5;
          }

          @media print {
            .container {
              page-break-inside: avoid;
            }
            .card {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${cards}
        </div>
      </body>
    </html>
  `;
};
