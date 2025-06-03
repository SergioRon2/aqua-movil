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
  cantidadItems: number,
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

          .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 14px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <h1>Resumen general de ${nombreMunicipio}</h1>
        <div class="subtitulo">Exportado: ${fechaExportacion}</div>

        <div class="cards-container">
          ${renderCard(avances.avanceFinanciero)}
          ${renderCard(avances.avanceFisico)}
          ${renderCard(avances.indicadorTiempo)}

          <div class="card total">
            <h2>Total de Proyectos</h2>
            <p>${cantidadItems}</p>
          </div>
        </div>

        <div class="footer">Datos generados automáticamente</div>
      </body>
    </html>
  `;
};
