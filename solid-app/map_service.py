from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import requests

app_map = Flask(__name__)
CORS(app_map)  # Habilitar CORS para todas las rutas

# API Key de Google Maps
API_KEY = 'AIzaSyDTziMJXD_LXeJlxN2c8fZSsLWY65m3VHg'

@app_map.route('/map')
def index():
    route_data = get_route()
    return jsonify(route=route_data)

def get_route():
    # Cargar el archivo CSV
    df = pd.read_csv('archivos/rutas.csv')
    obj = 6 #Es la fila del CSV que se esta usando // aqui puede ir el ID de la ruta que se desea visualizar

    # Filtrar los datos relevantes
    start_lat = df['LAT'].iloc[0]  # Primer punto
    start_long = df['LONG'].iloc[0]
    end_lat = df['LAT'].iloc[obj]  # Último punto
    end_long = df['LONG'].iloc[obj]
    total_length = df['length_km'].iloc[obj]  # Sumar la columna 'length_km'

    # Definir puntos de inicio y fin para la solicitud
    start_point = f"{start_lat},{start_long}"
    end_point = f"{end_lat},{end_long}"

    # Construir la URL de solicitud para Directions API
    directions_url = f"https://maps.googleapis.com/maps/api/directions/json?origin={start_point}&destination={end_point}&key={API_KEY}"

    # Realizar la solicitud
    response = requests.get(directions_url)
    data = response.json()

    # Verificar si la solicitud fue exitosa
    if data['status'] == 'OK':
        route = data['routes'][0]['legs'][0]
        steps = []
        
        # Extraer instrucciones y coordenadas de cada paso
        for step in route['steps']:
            steps.append({
                "lat": step['end_location']['lat'],
                "lng": step['end_location']['lng'],
                "instructions": step['html_instructions']
            })

        return {
            "distance": route['distance']['text'],
            "duration": route['duration']['text'],
            "steps": steps,
            "start_lat": start_lat,
            "start_long": start_long,
            "end_lat": end_lat,
            "end_long": end_long,
            "total_length_km": total_length  # Agregar la suma total de length_km
        }
    else:
        return {"error": f"Error en la solicitud: {data['status']}"}

if __name__ == '__main__':
    app_map.run(port=5001, debug=True)
