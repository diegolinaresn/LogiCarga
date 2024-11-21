import { onMount } from "solid-js";
import Chart from "chart.js/auto";
import AuthGuard from "~/components/login/AuthGuard";
export default function Analitica() {
  let efficiencyChartCanvas, economicLossChartCanvas, riskAnalysisChartCanvas;

  // Initialize charts when the component mounts
  onMount(() => {
    // Risk Analysis Chart (Pie)
    new Chart(riskAnalysisChartCanvas, {
      type: "pie",
      data: {
        labels: ["Bajo", "Moderado", "Alto"],
        datasets: [
          {
            label: "Análisis de Riesgos",
            data: [50, 30, 20],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });

    // Delivery Efficiency Chart (Line)
    new Chart(efficiencyChartCanvas, {
      type: "line",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
          {
            label: "Eficiencia en Entregas (%)",
            data: [95, 92, 88, 90, 94, 97],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });

    // Economic Loss Chart (Bar)
    new Chart(economicLossChartCanvas, {
      type: "bar",
      data: {
        labels: ["Ruta A", "Ruta B", "Ruta C", "Ruta D"],
        datasets: [
          {
            label: "Pérdidas Económicas ($)",
            data: [5000, 7000, 3000, 6000],
            backgroundColor: ["rgba(255, 99, 132, 0.6)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });

  return (
    
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Analítica</h1>

    
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Risk Analysis Chart (Pie) */}
  <div class="col-span-1 md:col-span-1 bg-white p-6 rounded shadow-md border border-gray-100 overflow-hidden" style="width: 100%; height: 67vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <h2 class="text-lg font-bold mb-4">Análisis de Riesgos</h2>
    <canvas ref={(el) => (riskAnalysisChartCanvas = el)} class="w-full h-full"></canvas>
  </div>

  {/* Right Section: Two Charts */}
  <div class="col-span-1 md:col-span-2 grid grid-rows-2 gap-6 justify-items-center">
    {/* Delivery Efficiency Chart */}
    <div class="bg-white p-6 rounded shadow-md border border-gray-100 overflow-hidden" style="height: 32vh; width: 90%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h2 class="text-lg font-bold mb-4">Eficiencia en Entregas</h2>
      <canvas ref={(el) => (efficiencyChartCanvas = el)} class="w-full h-full"></canvas>
    </div>

    {/* Economic Loss Chart */}
    <div class="bg-white p-6 rounded shadow-md border border-gray-100 overflow-hidden" style="height: 32vh; width: 90%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h2 class="text-lg font-bold mb-4">Pérdidas Económicas</h2>
      <canvas ref={(el) => (economicLossChartCanvas = el)} class="w-full h-full"></canvas>
    </div>
  </div>
</div>


    </main>
    
  );
}
