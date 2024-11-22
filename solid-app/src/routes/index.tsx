import { A } from "@solidjs/router";

export default function Home() {
  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-sky-700 font-bold uppercase mb-8 text-center">Dashboard</h1>

      {/* Cards Section */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Clients */}
        <div class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-xl font-bold text-sky-700 mb-4">Clientes</h2>
          <p class="text-gray-600 mb-4">Gestiona la información de tus clientes.</p>
          <button class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition">
            Ver Clientes
          </button>
        </div>

        {/* Card 2: Orders */}
        <div class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-xl font-bold text-sky-700 mb-4">Pedidos</h2>
          <p class="text-gray-600 mb-4">
            Creación y gestión de pedidos con seguimiento en tiempo real.
          </p>
          <button class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition">
            Ver Pedidos
          </button>
        </div>

        {/* Card 3: Analytics */}
        <div class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-xl font-bold text-sky-700 mb-4">Analítica</h2>
          <p class="text-gray-600 mb-4">
            Gráficos e indicadores para analizar datos clave.
          </p>
          <button class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition">
            Ver Analítica
          </button>
        </div>
      </div>

      {/* Optional Footer */}
      <footer class="text-center mt-16 text-gray-600">
      </footer>
    </main>
  );
};

