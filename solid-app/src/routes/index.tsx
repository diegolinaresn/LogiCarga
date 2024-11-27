import { createSignal, onMount } from "solid-js";
import MapComponentWithChart from "../components/MapaDashboard";
import GraficoPerdidas from "../components/GraficoPerdidas";

export default function Home() {
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => {
    setIsClient(true);
  });

  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 uppercase my-8 font-bold">Dashboard Principal Público</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mapa de Rutas y Cierres Viales */}
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Mapa de Rutas y Cierres Viales</h2>
          <div style="height: 50%;">
            {isClient() && <MapComponentWithChart />}
          </div>
        </div>

        {/* Gráfico de Barras de Pérdidas Económicas */}
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h2 class="text-2xl text-sky-700 uppercase my-4 font-bold">Gráfico de Barras de Pérdidas Económicas</h2>
          <div style="height: 50%;">
            {isClient() && <GraficoPerdidas />}
          </div>
        </div>
      </div>
    </main>
  );
}