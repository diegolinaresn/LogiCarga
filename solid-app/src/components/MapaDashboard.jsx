import { createSignal, onMount } from "solid-js";

const MapComponentWithChart = () => {
  let map; // Google Maps instance
  let vehicleMarker; // Marker for the vehicle
  let stepInterval; // Interval for vehicle movement
  let mapContainer; // Reference to the map div container
  let directionsRenderer; // Renderer for displaying the route on the map

  const [duration, setDuration] = createSignal("Loading...");
  const [routeData, setRouteData] = createSignal(null);
  const [routeId, setRouteId] = createSignal(""); // Signal for the selected route ID
  const [tramos, setTramos] = createSignal([]); // Signal for cod_tramo options
  const [viasAfectadas, setViasAfectadas] = createSignal([]); // Signal for affected roads
  const [fuelCost, setFuelCost] = createSignal(0); // Signal for fuel cost
  const [isLoadingMap, setIsLoadingMap] = createSignal(true); // Nuevo estado para el indicador de carga del mapa

  // Constants for fuel calculation
  const FUEL_PRICE_PER_LITER = 26; // MXN per liter
  const FUEL_CONSUMPTION_PER_KM = 0.12; // Liters per km (assume 12 km/L efficiency)

  // Define closures with their locations and severities
  const closures = [
    {
      start: { lat: 4.711, lng: -74.0721 },
      end: { lat: 4.712, lng: -74.0731 },
      severity: "high",
      description: "Cierre vial severo",
    },
    {
      start: { lat: 4.713, lng: -74.0741 },
      end: { lat: 4.714, lng: -74.0751 },
      severity: "medium",
      description: "Cierre vial moderado",
    },
    {
      start: { lat: 4.715, lng: -74.0761 },
      end: { lat: 4.716, lng: -74.0771 },
      severity: "low",
      description: "Cierre vial leve",
    },
    {
      start: { lat: 4.717, lng: -74.0781 },
      end: { lat: 4.718, lng: -74.0791 },
      severity: "high",
      description: "Cierre vial severo",
    },
    {
      start: { lat: 4.719, lng: -74.0801 },
      end: { lat: 4.720, lng: -74.0811 },
      severity: "medium",
      description: "Cierre vial moderado",
    },
    {
      start: { lat: 4.721, lng: -74.0821 },
      end: { lat: 4.722, lng: -74.0831 },
      severity: "low",
      description: "Cierre vial leve",
    },
  ];

  // Initialize the Google Map
  const initMap = () => {
    if (!window.google) {
      console.error("Google Maps API failed to load.");
      return;
    }

    map = new google.maps.Map(mapContainer, {
      zoom: 14, // Set a higher zoom level
      center: { lat: 4.713, lng: -74.0741 }, // Center around the closures
      mapTypeId: "roadmap", // Roadmap view
    });

    // Initialize the DirectionsRenderer
    directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true, // We will use custom markers
    });

    // Add closure routes to the map
    closures.forEach((closure) => {
      const directionsService = new google.maps.DirectionsService();
      const request = {
        origin: closure.start,
        destination: closure.end,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (response, status) => {
        if (status === "OK") {
          const polyline = new google.maps.Polyline({
            path: response.routes[0].overview_path,
            geodesic: true,
            strokeColor:
              closure.severity === "high"
                ? "#FF0000"
                : closure.severity === "medium"
                ? "#FFA500"
                : "#FFFF00",
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });

          polyline.setMap(map);

          const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${closure.description}</strong></div>`,
          });

          polyline.addListener("click", (event) => {
            infoWindow.setPosition(event.latLng);
            infoWindow.open(map);
          });
        } else {
          console.error("Directions request failed:", status);
        }
      });
    });
  };

  // Fetch available tramos from the backend
  const fetchTramos = async () => {
    try {
      const response = await fetch("http://localhost:5001/map/tramos");
      const data = await response.json();
      setTramos(data.tramos || []);
      console.log("Fetched tramos:", data.tramos);
    } catch (error) {
      console.error("Error fetching tramos data:", error);
    }
  };

  // Fetch affected roads for the selected tramo
  const fetchViasAfectadas = async () => {
    try {
      const response = await fetch(`http://localhost:5001/map/vias?tramo_id=${routeId()}`);
      const data = await response.json();

      if (data.vias) {
        setViasAfectadas(data.vias);
      } else {
        setViasAfectadas([]);
        alert(`No se encontraron vías afectadas para el tramo ${routeId()}.`);
      }
    } catch (error) {
      console.error("Error fetching affected roads:", error);
    }
  };

  // Fetch route data from the API
  const fetchRouteData = async () => {
    if (!routeId()) {
      alert("Por favor, selecciona un ID de tramo.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/map?route_id=${routeId()}`);
      const data = await response.json();

      if (data.route) {
        const route = data.route;
        setDuration(route.duration);
        setRouteData(route);

        // Calculate fuel cost
        const distanceInKm = parseFloat(route.distance.split(" ")[0]); // Extract numerical value
        const fuelUsed = distanceInKm * FUEL_CONSUMPTION_PER_KM; // Liters used
        const cost = fuelUsed * FUEL_PRICE_PER_LITER; // Total cost
        setFuelCost(cost.toFixed(2)); // Round to 2 decimals

        // Clear previous route and marker
        clearPreviousRoute();

        // Set map center to starting point
        if (route.steps && route.steps.length > 0) {
          const startPoint = route.steps[0];
          map.setCenter(new google.maps.LatLng(startPoint.lat, startPoint.lng));
        }

        // Render the route on the map
        renderRoute(route);

        // Simulate vehicle movement
        simulateVehicle(route.steps);

        // Fetch affected roads
        fetchViasAfectadas();
      } else if (data.error) {
        console.error("API Error:", data.error);
        alert(`Error al obtener la ruta: ${data.error}`);
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  // Clear previous route and marker
  const clearPreviousRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null); // Remove previous route
    }
    if (vehicleMarker) {
      vehicleMarker.setMap(null); // Remove vehicle marker
    }
    clearInterval(stepInterval); // Stop vehicle movement
  };

  // Render the route on the map
  const renderRoute = (routeData) => {
    const directionsService = new google.maps.DirectionsService();

    directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: false, // Allow default markers
    });

    const start = new google.maps.LatLng(
      parseFloat(routeData.steps[0].lat),
      parseFloat(routeData.steps[0].lng)
    );
    const end = new google.maps.LatLng(
      parseFloat(routeData.steps[routeData.steps.length - 1].lat),
      parseFloat(routeData.steps[routeData.steps.length - 1].lng)
    );

    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING, // Driving mode
    };

    directionsService.route(request, (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response); // Draw route on map
      } else {
        console.error("Directions request failed:", status);
      }
    });
  };

  // Simulate vehicle movement along the steps
  const simulateVehicle = (steps) => {
    vehicleMarker = new google.maps.Marker({
      position: { lat: 0, lng: 0 }, // Placeholder
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

  // Load Google Maps and fetch data
  onMount(() => {
    fetchTramos();

    const loadGoogleMaps = () => {
      if (window.google) {
        initMap();
      } else {
        console.error("Google Maps API not loaded.");
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
      script.onerror = () => console.error("Failed to load Google Maps API.");
      document.head.appendChild(script);
    }
  });

  return (
    <div style="font-family: 'Poppins', sans-serif;">
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div
          id="map"
          ref={(el) => (mapContainer = el)}
          style="height: 400px; width: 100%; border-radius: 10px; margin: 20px 0; flex: 1;"
        ></div>
      </div>
      
      <div>
        <h2 style="font-size: 24px; font-weight: bold; color: #0056b3; margin-bottom: 20px;">Simbología</h2>
        <ul style="list-style: none; padding: 0; display: flex; gap: 20px;">
          <li style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 20px; height: 20px; background-color: #FF0000; margin-right: 10px;"></span>
            <span style="font-size: 18px; color: #444;">Cierre vial severo</span>
          </li>
          <li style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 20px; height: 20px; background-color: #FFA500; margin-right: 10px;"></span>
            <span style="font-size: 18px; color: #444;">Cierre vial moderado</span>
          </li>
          <li style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 20px; height: 20px; background-color: #FFFF00; margin-right: 10px;"></span>
            <span style="font-size: 18px; color: #444;">Cierre vial leve</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MapComponentWithChart;