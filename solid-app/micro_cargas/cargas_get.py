from flask import Flask, jsonify, request
import logging
import mysql.connector
from db_config import DB_CONFIG
from flask_cors import CORS

# Configuración inicial
app = Flask(__name__)
CORS(app)

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

@app.route('/cargues', methods=['GET'])
def obtener_cargues():
    """
    Endpoint para obtener cargues con búsqueda específica por CODIGO_CARGUE
    o búsqueda general por otros campos como CARGUE o FECHASALIDACARGUE.
    Incluye paginación con LIMIT y OFFSET.
    """
    logging.info("Solicitud GET recibida en /cargues")
    
    # Parámetros de consulta
    limit = request.args.get('limit', 7, type=int)  # Límite de resultados (default 7)
    offset = request.args.get('offset', 0, type=int)  # Desplazamiento (default 0)
    search = request.args.get('search', '', type=str)  # Parámetro de búsqueda

    try:
        # Conexión a la base de datos
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Condicional para manejar búsquedas específicas o generales
        if search.isdigit():  # Buscar por CODIGO_CARGUE si el término es numérico
            query = """
            SELECT CODIGO_CARGUE, CARGUE, FECHASALIDACARGUE, HORA_SALIDA_CARGUE, 
                   HORAS_ESPERA_CARGUE, HORAS_CARGUE
            FROM cargues
            WHERE CODIGO_CARGUE = %s
            """
            cursor.execute(query, (search,))
        elif search:  # Búsqueda general en otros campos
            query = """
            SELECT CODIGO_CARGUE, CARGUE, FECHASALIDACARGUE, HORA_SALIDA_CARGUE, 
                   HORAS_ESPERA_CARGUE, HORAS_CARGUE
            FROM cargues
            WHERE CARGUE LIKE %s OR FECHASALIDACARGUE LIKE %s
            LIMIT %s OFFSET %s
            """
            search_query = f"%{search}%"
            cursor.execute(query, (search_query, search_query, limit, offset))
        else:  # Si no hay búsqueda, solo realiza paginación
            query = """
            SELECT CODIGO_CARGUE, CARGUE, FECHASALIDACARGUE, HORA_SALIDA_CARGUE, 
                   HORAS_ESPERA_CARGUE, HORAS_CARGUE
            FROM cargues
            LIMIT %s OFFSET %s
            """
            cursor.execute(query, (limit, offset))

        # Obtener resultados
        cargues = cursor.fetchall()

        # Manejo de resultados vacíos
        if not cargues:
            logging.info("No se encontraron resultados para la consulta.")
            return jsonify([]), 200  # Devuelve una lista vacía con status 200

        # Respuesta exitosa
        return jsonify(cargues), 200

    except Exception as e:
        # Manejo de errores
        logging.exception("Error al obtener cargues")
        return jsonify({"error": str(e)}), 500

    finally:
        # Cierre de conexión a la base de datos
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    # Configuración del servidor Flask
    app.run(host='0.0.0.0', port=6010, debug=True)
