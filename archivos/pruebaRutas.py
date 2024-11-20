import pandas as pd
import requests

# Tu API Key de Google Maps
API_KEY = 'AIzaSyDTziMJXD_LXeJlxN2c8fZSsLWY65m3VHg'

# Cargar el archivo CSV
df = pd.read_csv('archivos/rutas.csv')

# Filtrar los datos relevantes
# Asumimos que hay puntos de inicio y fin en LONG/LAT
start_lat = df['LAT'].iloc[0]  # Ejemplo: primer punto de inicio
start_long = df['LONG'].iloc[0]
end_lat = df['LAT'].iloc[-1]  # Ejemplo: último punto de destino
end_long = df['LONG'].iloc[-1]

# Definir los puntos de inicio y fin para la solicitud
start_point = f"{start_lat},{start_long}"
end_point = f"{end_lat},{end_long}"

# Construir la URL de solicitud para Directions API
directions_url = f"https://maps.googleapis.com/maps/api/directions/json?origin={start_point}&destination={end_point}&key={API_KEY}"

# Realizar la solicitud a la API de Google Maps Directions
response = requests.get(directions_url)
data = response.json()

# Verificar si la solicitud fue exitosa
if data['status'] == 'OK':
    # Extraer la ruta óptima
    route = data['routes'][0]['legs'][0]
    
    # Información relevante
    print(f"Distancia: {route['distance']['text']}")
    print(f"Duración: {route['duration']['text']}")
    
    # Instrucciones paso a paso
    print("\nIndicaciones paso a paso:")
    for step in route['steps']:
        print(step['html_instructions'])
else:
    print(f"Error en la solicitud: {data['status']}")
