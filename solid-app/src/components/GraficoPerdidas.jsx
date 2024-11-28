import { onMount } from "solid-js";
import { getEconomicLossAll } from "../utils/api.js";
import Chart from "chart.js/auto";

const GraficoPerdidas = () => {
  let canvasContainer; // Referencia al div que contiene el canvas

  onMount(async () => {
    // Llama al endpoint para obtener los datos
    const data = await getEconomicLossAll();

    if (data && data.economic_losses) {
      const sectors = data.economic_losses.map((entry) => entry.sector); // Sectores
      const avgLosses = data.economic_losses.map((entry) =>
        parseFloat(entry.avg_loss)
      ); // Convertir a número
      const totalLosses = data.economic_losses.map((entry) =>
        parseFloat(entry.total_loss)
      ); // Convertir a número

      const ctx = canvasContainer.getContext("2d");
      new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Pérdidas Económicas por Sector",
              data: sectors.map((sector, index) => ({
                x: avgLosses[index], // Eje X: Pérdida promedio
                y: totalLosses[index], // Eje Y: Pérdida total
                r: Math.sqrt(totalLosses[index]) / 1000, // Tamaño del punto
              })),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true, // Hace que la gráfica sea responsiva
          maintainAspectRatio: false, // Permite ocupar todo el espacio del contenedor
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const sector = sectors[context.dataIndex];
                  const avgLoss = avgLosses[context.dataIndex];
                  const totalLoss = totalLosses[context.dataIndex];
                  return [
                    `Sector: ${sector}`,
                    `Pérdida Promedio: $${avgLoss.toLocaleString()}`,
                    `Pérdida Total: $${totalLoss.toLocaleString()}`,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Pérdida Promedio (USD)",
              },
              beginAtZero: true,
            },
            y: {
              title: {
                display: true,
                text: "Pérdida Total (USD)",
              },
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error("No se encontraron datos de pérdidas económicas.");
    }
  });

  return (
    <div style="width: 100%; height: 100%;">
      <canvas
        ref={(el) => (canvasContainer = el)}
        style="width: 100%; height: 100%;"
      ></canvas>
    </div>
  );
};

export default GraficoPerdidas;
