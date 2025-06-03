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
  cantidadItems: number,
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
    { name: "Total de Proyectos", value: cantidadItems },
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
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <div class="subtitulo">Exportado: ${fechaExportacion}</div>

        <div class="cards-container">
          ${indicadores.map(renderCard).join("")}
        </div>

        <div class="footer">Datos generados automáticamente</div>
      </body>
    </html>
  `;
};
