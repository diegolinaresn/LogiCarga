import { createSignal, onMount } from "solid-js";
import { isLoggedIn } from "../components/authstore";
import { getSectorLosses } from "../utils/api.js";
import Chart from "chart.js/auto";
import MapComponentWithChart from "../components/MapaDashboard";
import GraficoPerdidas from "~/components/GraficoPerdidas";

// Tipado para los datos de pérdidas económicas
interface SectorLoss {
  sector: string;
  total_loss: number;
}

// Gráfico de Líneas con Puntos y Barras (Datos Reales)
const LineChartWithBars = () => {
  const [sectorLosses, setSectorLosses] = createSignal<SectorLoss[]>([]);

  onMount(async () => {
    try {
      const data = await getSectorLosses();
      if (data?.sector_losses) {
        setSectorLosses(data.sector_losses);
        renderChart(data.sector_losses);
      } else {
        console.error("No se encontraron datos de pérdidas económicas por sector.");
      }
    } catch (error) {
      console.error("Error al obtener datos de pérdidas económicas por sector:", error);
    }
  });

  const renderChart = (data: SectorLoss[]) => {
    const labels = data.map((item) => item.sector);
    const avgLosses = data.map((item) => item.total_loss);

    const ctx = document.getElementById("lineChartWithBars") as HTMLCanvasElement;

    new Chart(ctx.getContext("2d")!, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Pérdidas Económicas por Sector (USD)",
            data: avgLosses,
            backgroundColor: "rgba(75,192,192,0.7)",
            borderColor: "rgba(75,192,192,1)",
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: "Pérdidas Económicas por Sector" },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  };

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      <canvas id="lineChartWithBars"></canvas>
    </div>
  );
};

// Gráfico de Barras (Datos Reales de Costos de Transporte)
const SimpleBarChart = () => {
  const [sectorLosses, setSectorLosses] = createSignal<SectorLoss[]>([]);

  onMount(async () => {
    try {
      const data = await getSectorLosses();
      if (data?.sector_losses) {
        setSectorLosses(data.sector_losses);
        renderBarChart(data.sector_losses);
      } else {
        console.error("No se encontraron datos de pérdidas económicas por sector.");
      }
    } catch (error) {
      console.error("Error al obtener datos de pérdidas económicas por sector:", error);
    }
  });

  const renderBarChart = (data: SectorLoss[]) => {
    const labels = data.map((item) => item.sector);
    const losses = data.map((item) => item.total_loss);

    const ctx = document.getElementById("simpleBarChart") as HTMLCanvasElement;

    new Chart(ctx.getContext("2d")!, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Pérdidas Económicas por Sector (USD)",
            data: losses,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: "Pérdidas Económicas por Sector" },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  };

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      <canvas id="simpleBarChart"></canvas>
    </div>
  );
};

// Dashboard Privado
const PrivateDashboard = () => {
  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Dashboard Privado</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <LineChartWithBars />
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <GraficoPerdidas />
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md mt-8">
        <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Mapa de Rutas Optimizadas</h2>
        <MapComponentWithChart />
      </div>
    </main>
  );
};

// Dashboard Público
const PublicDashboard = () => {
  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Dashboard Público</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Mapa de Rutas y Cierres Viales</h2>
          <div style={{ height: "50%" }}>
            <MapComponentWithChart />
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Gráfico de Barras de Pérdidas Económicas</h2>
          <div style={{ height: "50%" }}>
            <SimpleBarChart />
          </div>
        </div>
      </div>
    </main>
  );
};

// Componente Principal
const App = () => {
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => {
    setIsClient(true);
  });

  return (
    <div>
      {isClient() ? (isLoggedIn() ? <PrivateDashboard /> : <PublicDashboard />) : <p>Cargando...</p>}
    </div>
  );
};

export default App;
