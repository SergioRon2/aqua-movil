interface Avance {
  name: string;
  value: number;
}

interface Avances {
  avanceFinanciero: Avance;
  avanceFisico: Avance;
  indicadorTiempo: Avance;
}

export const generarResumenSectorialUnicoHTML = (nombreSectorial: string, cantidadItems: number, avances: Avances) => {
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
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background-color: #fff;
            color: #333;
          }

          h1 {
            text-align: center;
            color: #222;
            margin-bottom: 40px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
            font-size: 16px;
          }

          th, td {
            padding: 12px 18px;
            border: 1px solid #ddd;
            text-align: center;
          }

          th {
            background-color: #f4f4f4;
            color: #444;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777;
            text-align: center;
          }
        </style>
      </head>
      <body>

        <div class="excel-header">
          <h1>Resumen general de ${nombreSectorial}</h1> <br/>
          Exportado: ${fechaExportacion}
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Indicador</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>${avances.avanceFinanciero.name}</td>
              <td>${avances.avanceFinanciero.value}%</td>
            </tr>
            <tr>
              <td>2</td>
              <td>${avances.avanceFisico.name}</td>
              <td>${avances.avanceFisico.value}%</td>
            </tr>
            <tr>
              <td>3</td>
              <td>${avances.indicadorTiempo.name}</td>
              <td>${avances.indicadorTiempo.value}%</td>
            </tr>
            <tr>
              <td>4</td>
              <td><strong>Total de Proyectos</strong></td>
              <td><strong>${cantidadItems}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="footer">Datos generados automáticamente</div>
      </body>
    </html>
  `;
};
