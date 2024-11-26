import { createSignal, onMount } from "solid-js";

const MapComponentWithChart = () => {
  let map; // Google Maps instance
  let mapContainer; // Reference to the map div container
  let directionsRenderer; // Renderer for displaying the route on the map

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
  ];

  // Define warnings with their locations and descriptions
  const warnings = [
    {
      position: { lat: 4.715, lng: -74.075 },
      description: "Bache en la carretera",
    },
    {
      position: { lat: 4.718, lng: -74.078 },
      description: "Tráfico denso",
    },
  ];

  // Initialize the Google Map
  const initMap = () => {
    if (!window.google) {
      console.error("Google Maps API failed to load.");
      return;
    }

    map = new google.maps.Map(mapContainer, {
      zoom: 14,
      center: { lat: 4.713, lng: -74.0741 },
      mapTypeId: "roadmap",
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

    // Add warning markers to the map
    const bounds = new google.maps.LatLngBounds();
    warnings.forEach((warning) => {
      const marker = new google.maps.Marker({
        position: warning.position,
        map: map,
        title: "Warning",
        icon: {
          url: "https://maps.gstatic.com/mapfiles/ms2/micons/warning.png",
          scaledSize: new google.maps.Size(30, 30), // Customize icon size
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${warning.description}</strong></div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      bounds.extend(marker.position); // Include marker in bounds
    });

    map.fitBounds(bounds); // Adjust map to fit all markers
  };

  // Load Google Maps and fetch data
  onMount(() => {
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
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
      <div style="margin-top: -10px; padding: 15px;">
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
};

export default MapComponentWithChart;