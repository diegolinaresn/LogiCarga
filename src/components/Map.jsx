import { createSignal, onMount } from "solid-js";
import Chart from "chart.js/auto";

const MapComponentWithChart = (props) => {
  let map; // Google Maps instance
  let vehicleMarker; // Marker for the vehicle
  let stepInterval; // Interval for vehicle movement
  let mapContainer; // Reference to the map div container
  let chartCanvas; // Reference to the Chart.js canvas element

  const [duration, setDuration] = createSignal("Loading...");
  const [routeData, setRouteData] = createSignal(null);

  // Initialize the Google Map
  const initMap = () => {
    if (!window.google) {
      console.error("Google Maps API failed to load.");
      return;
    }

    map = new google.maps.Map(mapContainer, {
      zoom: 14,
      center: { lat: 0, lng: 0 }, // Placeholder, updated with fetched data
    });
  };

  // Fetch route data from the API
  const fetchRouteData = async () => {
    try {
      const response = await fetch(props.apiUrl || "http://localhost:5001/map");
      const data = await response.json();

      if (data.route) {
        const route = data.route;
        setDuration(route.duration);
        setRouteData(route);

        // Center the map on the starting point
        if (route.start_lat && route.start_long) {
          map.setCenter(new google.maps.LatLng(route.start_lat, route.start_long));
        } else {
          console.error("Invalid starting coordinates.");
        }

        // Render the route on the map
        renderRoute(route);

        // Simulate vehicle movement
        simulateVehicle(route.steps);

        // Render the chart
        renderChart(route);
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  // Render the route on the map using the Directions API
  const renderRoute = (routeData) => {
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    const start = new google.maps.LatLng(routeData.start_lat, routeData.start_long);
    const end = new google.maps.LatLng(routeData.end_lat, routeData.end_long);

    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (response, status) => {
      if (status === "OK") {
        directionsDisplay.setDirections(response);
      } else {
        console.error("Directions request failed:", status);
      }
    });
  };

  // Simulate the vehicle movement along the steps
  const simulateVehicle = (steps) => {
    vehicleMarker = new google.maps.Marker({
      position: { lat: 0, lng: 0 }, // Placeholder, updated dynamically
      map: map,
      title: "Vehicle",
      icon: {
        url: "https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png",
        scaledSize: new google.maps.Size(30, 30),
      },
    });

    let currentStep = 0;

    stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        if (step.lat && step.lng) {
          vehicleMarker.setPosition(new google.maps.LatLng(step.lat, step.lng));
        } else {
          console.error("Invalid step coordinates:", step);
        }
        currentStep++;
      } else {
        clearInterval(stepInterval);
      }
    }, 1000);
  };

  // Render Chart.js graph
  const renderChart = (route) => {
    if (chartCanvas) {
      new Chart(chartCanvas, {
        type: "bar",
        data: {
          labels: ["Duration", "Distance"], // Example labels
          datasets: [
            {
              label: "Route Metrics",
              data: [parseFloat(route.duration.split(" ")[0]), parseFloat(route.distance.split(" ")[0])],
              backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
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
    }
  };

  // Load Google Maps and fetch data
  onMount(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initMap();
        fetchRouteData();
      } else {
        console.error("Google Maps API not loaded. Check your API key and permissions.");
      }
    };

    if (window.google) {
      loadGoogleMaps();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDTziMJXD_LXeJlxN2c8fZSsLWY65m3VHg`;
      script.async = true;
      script.defer = true;
      script.onload = loadGoogleMaps;
      script.onerror = () => console.error("Failed to load Google Maps API script.");
      document.head.appendChild(script);
    }
  });

  return (
    <div style="font-family: 'Poppins', sans-serif;">
      <h1>Mapa y Gráfica de la Ruta</h1>
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        {/* Google Maps Container */}
        <div
          id="map"
          ref={(el) => (mapContainer = el)}
          style="height: 400px; width: 100%; border-radius: 10px; margin: 20px 0; flex: 1;"
        ></div>

        {/* Chart.js Container */}
        <div style="flex: 1; padding: 20px; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2>Gráfica de la Ruta</h2>
          <canvas ref={(el) => (chartCanvas = el)} style="width: 100%; height: 300px;"></canvas>
        </div>
      </div>
    </div>
  );
};

export default MapComponentWithChart;
