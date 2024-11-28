import { createSignal, onMount } from "solid-js";
import { getTramosAll } from "../utils/api.js";

const DashboardComponentWithGoogleMaps = () => {
  let map; // Google Maps instance
  let mapContainer; // Reference to the map container

  const [tramos, setTramos] = createSignal([]); // List of tramos with coordinates

  const API_KEY = "AIzaSyDTziMJXD_LXeJlxN2c8fZSsLWY65m3VHg"; // Your Google Maps API key

  // Fetch tramos and convert names to coordinates
  const fetchTramosWithCoordinates = async () => {
    try {
      const data = await getTramosAll();
      if (data?.tramos) {
        const convertedTramos = await Promise.all(
          data.tramos.map(async (tramo) => {
            const { startLocation, endLocation } = parseTramoName(tramo.tramo);
            const startCoords = await getCoordinatesFromName(startLocation);
            const endCoords = await getCoordinatesFromName(endLocation || getRandomLocation());
            return { ...tramo, startCoords, endCoords };
          })
        );
        setTramos(convertedTramos);
        plotAllTramosOnMap(convertedTramos); // Plot all tramos once data is ready
      }
    } catch (error) {
      console.error("Error fetching tramos:", error);
    }
  };

  // Parse tramo name to extract start and end locations
  const parseTramoName = (tramoName) => {
    const parts = tramoName.split(" - ");
    if (parts.length === 2) {
      return {
        startLocation: `${parts[0]} Colombia`,
        endLocation: `${parts[1]} Colombia`,
      };
    }
    console.warn(`Tramo name "${tramoName}" does not follow expected format.`);
    return {
      startLocation: `${tramoName} Colombia`,
      endLocation: null, // Handle single location cases
    };
  };

  // Get a random location in Colombia for fallback
  const getRandomLocation = () => {
    const randomCities = [
      "Bogotá",
      "Medellín",
      "Cali",
      "Cartagena",
      "Barranquilla",
      "Bucaramanga",
    ];
    const randomCity = randomCities[Math.floor(Math.random() * randomCities.length)];
    return `${randomCity} Colombia`;
  };

  // Get coordinates for a location name using Geocoding API
  const getCoordinatesFromName = async (locationName) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationName
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        console.warn(`No coordinates found for ${locationName}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Initialize Google Map
  const initGoogleMap = () => {
    if (!window.google) {
      console.error("Google Maps API failed to load.");
      return;
    }
    map = new google.maps.Map(mapContainer, {
      zoom: 6,
      center: { lat: 4.711, lng: -74.0721 },
      mapTypeId: "roadmap",
      disableDefaultUI: true, // Disable default UI
    });
  };

  // Plot all tramos on the map
  const plotAllTramosOnMap = (tramos) => {
    tramos.forEach((tramo) => {
      if (tramo.startCoords && tramo.endCoords) {
        addMarkersForTramo(tramo.startCoords, tramo.endCoords, tramo.tramo);
        plotTramoRoute(tramo.startCoords, tramo.endCoords, tramo);
      } else {
        console.warn(
          `Cannot plot tramo ${tramo.tramo}: Missing start or end coordinates`
        );
      }
    });
  };

  // Add markers for the start and end points of a tramo
  const addMarkersForTramo = (startCoords, endCoords, tramoName) => {
    // Marker for start point
    new google.maps.Marker({
      position: new google.maps.LatLng(startCoords.lat, startCoords.lng),
      map,
      title: `Inicio: ${tramoName}`,
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });

    // Marker for end point
    new google.maps.Marker({
      position: new google.maps.LatLng(endCoords.lat, endCoords.lng),
      map,
      title: `Fin: ${tramoName}`,
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });
  };

  // Generate route color based on length_km
  const getRouteColor = (lengthKm) => {
    if (lengthKm > 100) return "#FF0000"; // Red for long routes
    if (lengthKm > 50) return "#FFA500"; // Orange for medium routes
    return "#00FF00"; // Green for short routes
  };

  // Plot a single tramo route on the map
  const plotTramoRoute = (startCoords, endCoords, tramo) => {
    const directionsService = new google.maps.DirectionsService();
    const routeColor = getRouteColor(tramo.length_km);

    const request = {
      origin: new google.maps.LatLng(startCoords.lat, startCoords.lng),
      destination: new google.maps.LatLng(endCoords.lat, endCoords.lng),
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: { strokeColor: routeColor, strokeWeight: 5 },
        });

        // Create InfoWindow
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h4>${tramo.tramo}</h4>
              <p>Longitud: ${tramo.length_km} km</p>
            </div>
          `,
        });

        directionsRenderer.addListener("click", () => {
          infoWindow.open(map);
        });

        directionsRenderer.setDirections(result);
      } else {
        console.error("Directions request failed:", status);
      }
    });
  };

  // Initialize the component
  onMount(() => {
    fetchTramosWithCoordinates();

    if (window.google) {
      initGoogleMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
      script.async = true;
      script.onload = initGoogleMap;
      document.head.appendChild(script);
    }
  });

  return (
    <div>
      <h1>Dashboard con Google Maps</h1>
      <div
        ref={(el) => (mapContainer = el)}
        style="height: 600px; width: 100%; border: 1px solid #ccc;"
      ></div>
    </div>
  );
};

export default DashboardComponentWithGoogleMaps;
