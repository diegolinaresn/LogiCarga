import { createSignal, createEffect, Show, onMount } from "solid-js"; // Asegúrate de importar onMount
import Chart from "chart.js/auto";
import AnaliticaAvanzada from "~/components/analiticaAvanzada";
import { isLoggedIn } from "../components/authstore"; // Asegúrate de importar tu estado de autenticación global

export default function Analitica() {
let efficiencyChartCanvas, economicLossChartCanvas, riskAnalysisChartCanvas;

const [efficiencyData, setEfficiencyData] = createSignal([]);
const [economicLossData, setEconomicLossData] = createSignal([]);
const [riskAnalysisData, setRiskAnalysisData] = createSignal([]);
const [hydrated, setHydrated] = createSignal(false); // Evitar inconsistencias iniciales

let efficiencyChart, economicLossChart, riskAnalysisChart;

// Fetch data for efficiency chart
const fetchEfficiencyData = async () => {
try {
const response = await fetch(`http://localhost:5010/analytics/efficiency`);
const data = await response.json();
if (data.top_5_efficient_months) {
setEfficiencyData(data.top_5_efficient_months);
} else {
console.warn("No se encontraron datos de eficiencia.");
}
} catch (error) {
console.error("Error al obtener datos de eficiencia:", error);
}
};

// Fetch data for economic loss chart
const fetchEconomicLossData = async () => {
try {
const response = await fetch(`http://localhost:5010/analytics/economic_loss`);
const data = await response.json();
if (data.top_5_losses) {
setEconomicLossData(data.top_5_losses);
} else {
console.warn("No se encontraron datos de pérdidas económicas.");
}
} catch (error) {
console.error("Error al obtener datos de pérdidas económicas:", error);
}
};

// Fetch data for risk analysis chart
const fetchRiskAnalysisData = async () => {
try {
const response = await fetch(`http://localhost:5010/analytics/risk_analysis`);
const data = await response.json();
if (data.top_5_risks) {
setRiskAnalysisData(data.top_5_risks);
} else {
console.warn("No se encontraron datos de análisis de riesgos.");
}
} catch (error) {
console.error("Error al obtener datos de análisis de riesgos:", error);
}
};

const updateCharts = () => {
// Destroy existing charts if they exist
if (efficiencyChart) efficiencyChart.destroy();
if (economicLossChart) economicLossChart.destroy();
if (riskAnalysisChart) riskAnalysisChart.destroy();

// Efficiency chart
if (efficiencyData().length > 0) {
efficiencyChart = new Chart(efficiencyChartCanvas, {
type: "bar",
data: {
labels: efficiencyData().map((item) => `${item.month}/${item.year}`),
datasets: [
{
label: "Horas Promedio de Entrega",
data: efficiencyData().map((item) => item.avg_hours),
backgroundColor: "rgba(75, 192, 192, 0.6)",
},
],
},
options: {
responsive: true,
plugins: {
legend: { position: "top" },
},
scales: {
y: { beginAtZero: true },
},
},
});
}

// Economic loss chart
if (economicLossData().length > 0) {
economicLossChart = new Chart(economicLossChartCanvas, {
type: "pie",
data: {
labels: economicLossData().map((item) => item.sector || "Sin Especificar"),
datasets: [
{
label: "Pérdidas Económicas ($)",
data: economicLossData().map((item) => item.total_loss),
backgroundColor: [
"rgba(255, 99, 132, 0.6)",
"rgba(54, 162, 235, 0.6)",
"rgba(255, 206, 86, 0.6)",
"rgba(75, 192, 192, 0.6)",
"rgba(153, 102, 255, 0.6)",
],
},
],
},
options: {
responsive: true,
plugins: {
legend: { position: "top" },
},
},
});
}

// Risk analysis chart
if (riskAnalysisData().length > 0) {
riskAnalysisChart = new Chart(riskAnalysisChartCanvas, {
type: "bar",
data: {
labels: riskAnalysisData().map((item) => item.sector),
datasets: [
{
label: "Número de Bloqueos",
data: riskAnalysisData().map((item) => item.num_bloqueos),
backgroundColor: "rgba(255, 206, 86, 0.6)",
},
],
},
options: {
responsive: true,
plugins: {
legend: { position: "top" },
},
scales: {
y: { beginAtZero: true },
},
},
});
}
};

createEffect(() => {
setHydrated(true); // Marca como "hidratado"
});

onMount(async () => {
await Promise.all([fetchEfficiencyData(), fetchEconomicLossData(), fetchRiskAnalysisData()]);
updateCharts();
});

return (
<main class="p-8 bg-gray-100 min-h-screen">
<h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Analítica - TOP 5</h1>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Efficiency chart */}
<div class="col-span-1 bg-white p-6 rounded shadow-md border border-gray-100">
<h2 class="text-lg font-bold mb-4">TOP 5 Eficiencia en Entregas</h2>
<canvas ref={(el) => (efficiencyChartCanvas = el)}></canvas>
</div>

{/* Economic loss chart */}
<div class="col-span-1 bg-white p-6 rounded shadow-md border border-gray-100">
<h2 class="text-lg font-bold mb-4">TOP 5 Pérdidas Económicas</h2>
<canvas ref={(el) => (economicLossChartCanvas = el)}></canvas>
</div>

{/* Risk analysis chart */}
<div class="col-span-1 bg-white p-6 rounded shadow-md border border-gray-100">
<h2 class="text-lg font-bold mb-4">TOP 5 Tramos con Bloqueos</h2>
<canvas ref={(el) => (riskAnalysisChartCanvas = el)}></canvas>
</div>
</div>

{/* Mostrar AnaliticaAvanzada solo si el usuario está logueado */}
<Show when={hydrated() && isLoggedIn()}>
<div class="col-span-1 bg-white p-6 rounded shadow-md border border-gray-100">
<AnaliticaAvanzada />
</div>
</Show>
</main>
);
}