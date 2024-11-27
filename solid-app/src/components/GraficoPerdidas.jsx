import { onMount } from "solid-js";
import Chart from "chart.js/auto";

const GraficoPerdidas = () => {
  onMount(() => {
    const ctx = document.getElementById("barChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Ruta 1", "Ruta 2", "Ruta 3"],
        datasets: [{
          label: "Pérdidas Económicas",
          data: [12000, 19000, 3000],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });

  return <canvas id="barChart" width="120%" height="50%" margin-top="50%"></canvas>;
};

export default GraficoPerdidas;