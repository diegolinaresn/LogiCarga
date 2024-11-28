import { createSignal, onMount } from "solid-js";
import { isLoggedIn, logout } from "../components/authstore";
import MapComponentWithChart from "../components/MapaDashboard";
import GraficoPerdidas from "../components/GraficoPerdidas";

// Gráfico de Líneas con Puntos y Barras
const LineChartWithBars = () => {
  const data = [10, 15, 8, 12, 18, 20, 25, 5, 14, 30]; // Datos de ejemplo
  const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"]; // Meses
  const maxDataValue = Math.max(...data); // Valor máximo para normalizar
  const barWidth = 40; // Ancho de las barras

  return (
    <div style="display: flex; flex-direction: column; align-items: center; margin: 20px;">
      <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Tiempos de Entrega Promedio</h2>
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          height: 250px;
          width: 100%;
          max-width: 600px;
          position: relative;
          border-left: 2px solid black;
          border-bottom: 2px solid black;
        "
      >
        {/* Barras */}
        <div style="display: flex; align-items: flex-end; height: 100%; width: 100%; position: absolute;">
          {data.map((value, index) => (
            <div
              style={{
                height: `${(value / maxDataValue) * 100}%`,
                width: `${barWidth}px`,
                "background-color": "rgba(75,192,192,0.7)",
                margin: "0 10px",
                "border-radius": "4px",
              }}
            ></div>
          ))}
        </div>

        {/* Línea de datos */}
        <svg
          style="position: absolute; height: 100%; width: 100%;"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            points={data
              .map(
                (value, index) =>
                  `${(index / (data.length - 1)) * 100}%,${
                    100 - (value / maxDataValue) * 100
                  }%`
              )
              .join(" ")}
            fill="none"
            stroke="rgba(75,192,192,1)"
            stroke-width="2"
          />
        </svg>

        {/* Puntos */}
        <svg
          style="position: absolute; height: 100%; width: 100%;"
          xmlns="http://www.w3.org/2000/svg"
        >
          {data.map((value, index) => (
            <circle
              cx={`${(index / (data.length - 1)) * 100}%`}
              cy={`${100 - (value / maxDataValue) * 100}%`}
              r="5"
              fill="rgba(75,192,192,1)"
            />
          ))}
        </svg>
      </div>

      {/* Etiquetas del Eje X */}
      <div style="display: flex; justify-content: space-between; width: 100%; max-width: 600px; margin-top: 10px;">
        {labels.map((label) => (
          <span style="flex: 1; text-align: center; font-size: 14px; font-family: 'Poppins', sans-serif;">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

// Gráfico de Barras (Costos de Transporte)
const SimpleBarChart = () => {
  const data = [2000, 2500, 1800, 2200];
  const labels = ["Ruta 1", "Ruta 2", "Ruta 3", "Ruta 4"];
  const maxDataValue = Math.max(...data);

  return (
    <div style="display: flex; flex-direction: column; align-items: center; margin: 20px;">
      <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Costos de Transporte</h2>
      <div
        style="
          display: flex;
          align-items: flex-end;
          height: 250px;
          width: 100%;
          max-width: 600px;
          border-left: 2px solid black;
          border-bottom: 2px solid black;
        "
      >
        {data.map((value, index) => (
          <div
            style={{
              flex: 1,
              height: `${(value / maxDataValue) * 100}%`,
              "background-color": "rgba(75,192,192,0.7)",
              margin: "0 5px",
            }}
          ></div>
        ))}
      </div>

      {/* Etiquetas del Eje X */}
      <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px;">
        {labels.map((label) => (
          <span style="flex: 1; text-align: center; font-size: 14px; font-family: 'Poppins', sans-serif;">
            {label}
          </span>
        ))}
      </div>
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
          <SimpleBarChart />
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
          <div style="height: 50%;">
            <MapComponentWithChart />
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Gráfico de Barras de Pérdidas Económicas</h2>
          <div style="height: 50%;">
            <GraficoPerdidas />
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
