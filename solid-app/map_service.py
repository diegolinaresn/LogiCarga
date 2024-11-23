from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import requests

app_map = Flask(__name__)
CORS(app_map)  # Habilitar CORS para todas las rutas

# API Key de Google Maps
API_KEY = 'AIzaSyDTziMJXD_LXeJlxN2c8fZSsLWY65m3VHg'

# Configuración de la conexión a MySQL
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "6666",
    "database": "cargas"
}


@app_map.route('/map', methods=['GET'])
def index():
    route_id = request.args.get('route_id', default=None, type=int)  # Leer el parámetro route_id
    if not route_id:
        return jsonify({"error": "Debes proporcionar un parámetro 'route_id' en la solicitud."}), 400

    route_data = get_route(route_id)
    return jsonify(route=route_data)


def get_route(route_id):
    """Obtener los municipios y calcular la ruta"""
    try:
        # Conectar a la base de datos MySQL
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Consulta para obtener los tramos según el ID de ruta
        query = "SELECT sector FROM tramos WHERE cod_tramo = %s;"  # Filtrar por cod_tramo
        cursor.execute(query, (route_id,))
        result = cursor.fetchone()

        if not result:
            return {"error": f"No se encontraron datos para el ID de ruta: {route_id}"}

        # Procesar el sector
        sector = result[0]
        municipios = sector.split(" - ")
        if len(municipios) != 2:
            return {"error": "El formato del sector no es válido. Debe ser 'municipio1 - municipio2'."}

        start_municipio = municipios[0].strip()
        end_municipio = municipios[1].strip()

        # Debug: Verificar qué valores se están usando
        print(f"Procesando ruta: Inicio -> {start_municipio}, Fin -> {end_municipio}")

        # Construir la URL de solicitud para Google Maps Directions API
        directions_url = (
            f"https://maps.googleapis.com/maps/api/directions/json?"
            f"origin={start_municipio}, Colombia&destination={end_municipio}, Colombia&key={API_KEY}"
        )

        # Realizar la solicitud
        response = requests.get(directions_url)
        directions_data = response.json()

        # Verificar si la solicitud fue exitosa
        if directions_data['status'] == 'OK':
            route = directions_data['routes'][0]['legs'][0]
            steps = []

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
                "start_municipio": start_municipio,
                "end_municipio": end_municipio
            }
        else:
            # Mejor manejo de errores si Google Maps no encuentra la ruta
            return {
                "error": f"No se encontró una ruta entre {start_municipio} y {end_municipio}.",
                "google_status": directions_data['status']
            }

    except mysql.connector.Error as e:
        return {"error": f"Error al conectar o consultar la base de datos: {str(e)}"}
    except Exception as e:
        return {"error": f"Error al procesar los datos: {str(e)}"}

    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()


if __name__ == '__main__':
    app_map.run(port=5001, debug=True)
