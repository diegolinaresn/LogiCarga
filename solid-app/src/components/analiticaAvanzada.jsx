import { createSignal, onMount } from "solid-js";
import Chart from "chart.js/auto";

export default function AnaliticaAvanzada() {
  let efficiencyChartCanvas, economicLossChartCanvas, mapContainer;

  const [deliveryEfficiencyData, setDeliveryEfficiencyData] = createSignal([]);
  const [economicLossData, setEconomicLossData] = createSignal({});
  const [riskHeatmapData, setRiskHeatmapData] = createSignal([]);

  // Fetch data from /analytics/delivery_efficiency
  const fetchDeliveryEfficiency = async () => {
    try {
      const response = await fetch("http://localhost:5011/analytics/delivery_efficiency");
      const data = await response.json();
      setDeliveryEfficiencyData(data.delivery_efficiency || []);
    } catch (error) {
      console.error("Error fetching delivery efficiency data:", error);
    }
  };

  // Fetch data from /analytics/economic_losses
  const fetchEconomicLosses = async () => {
    try {
      const response = await fetch("http://localhost:5011/analytics/economic_losses");
      const data = await response.json();
      setEconomicLossData(data.economic_losses || {});
    } catch (error) {
      console.error("Error fetching economic losses data:", error);
    }
  };

  // Fetch data from /analytics/risk_heatmap
  const fetchRiskHeatmap = async () => {
    try {
      const response = await fetch("http://localhost:5011/analytics/risk_heatmap");
      const data = await response.json();
      setRiskHeatmapData(data.heatmap_data || []);
    } catch (error) {
      console.error("Error fetching risk heatmap data:", error);
    }
  };

  const loadGoogleMapsScript = (callback) => {
    const existingScript = document.getElementById("googleMaps");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDTziMJXD_LXeJlxN2c8fZSsLWY65m3VHg&libraries=visualization`;
      script.id = "googleMaps";
      script.async = true;
      script.defer = true;
      script.onload = callback;
      document.body.appendChild(script);
    } else {
      callback();
    }
  };

  const initializeMap = () => {
    const data = riskHeatmapData();
    if (data.length > 0) {
      const map = new google.maps.Map(mapContainer, {
        zoom: 6,
        center: { lat: 4.624335, lng: -74.063644 }, // Coordenadas iniciales
        mapTypeId: "roadmap",
      });

      // Crear puntos de calor
      const heatmapData = data.map((item) => ({
        location: new google.maps.LatLng(item.avg_lat, item.avg_long),
        weight: item.num_bloqueos,
      }));

      const heatmapLayer = new google.maps.visualization.HeatmapLayer({
        data: heatmapData.map((point) => ({
          location: point.location,
          weight: point.weight,
        })),
        map: map,
        radius: 40, // Ajuste del radio
      });

      console.log("Mapa de calor inicializado.");
    } else {
      console.warn("No hay datos para el mapa de calor.");
    }
  };

  const updateCharts = () => {
    // Delivery Efficiency Chart
    if (deliveryEfficiencyData().length > 0) {
      const labels = deliveryEfficiencyData().map(
        (item) => `Semana ${item.week} ${item.year}`
      );
      const totalDeliveries = deliveryEfficiencyData().map((item) => item.total_deliveries);

      new Chart(efficiencyChartCanvas, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Entregas Totales por Semana",
              data: totalDeliveries,
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
            legend: { position: "top" },
          },
        },
      });
    }

    // Economic Losses Chart
    if (Object.keys(economicLossData()).length > 0) {
      const productTypes = Object.keys(economicLossData());
      const datasets = productTypes.map((type) => ({
        label: type,
        data: economicLossData()[type].map((item) => item.total_loss),
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
      }));

      const labels = economicLossData()[productTypes[0]].map((item) => item.sector);

      new Chart(economicLossChartCanvas, {
        type: "bar",
        data: { labels, datasets },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
        },
      });
    }
  };

  onMount(() => {
    Promise.all([
      fetchDeliveryEfficiency(),
      fetchEconomicLosses(),
      fetchRiskHeatmap(),
    ]).then(() => {
      updateCharts();
      loadGoogleMapsScript(() => {
        initializeMap();
      });
    });
  });

  return (
    <main class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl text-blue-600 uppercase my-8 font-bold">Analítica Avanzada</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Delivery Efficiency Chart */}
        <div class="col-span-1 bg-white p-6 rounded shadow-md border">
          <h2 class="text-lg font-bold mb-4">Eficiencia en Entregas</h2>
          <canvas ref={(el) => (efficiencyChartCanvas = el)}></canvas>
        </div>

        {/* Economic Losses Chart */}
        <div class="col-span-1 bg-white p-6 rounded shadow-md border">
          <h2 class="text-lg font-bold mb-4">Pérdidas Económicas</h2>
          <canvas ref={(el) => (economicLossChartCanvas = el)}></canvas>
        </div>

        {/* Risk Heatmap */}
        <div class="col-span-1 bg-white p-6 rounded shadow-md border" style={{ height: "400px" }}>
          <h2 class="text-lg font-bold mb-4">Mapa de Calor de Riesgos</h2>
          <div ref={(el) => (mapContainer = el)} style={{ height: "100%" }}></div>
        </div>
      </div>
    </main>
  );
}
