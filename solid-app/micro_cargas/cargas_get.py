from flask import Flask, jsonify, request
import logging
from db_config import DB_CONFIG
from utils import setup_logging, error_response
import mysql.connector

app = Flask(__name__)

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

setup_logging()

@app.route('/cargues', methods=['GET'])
def obtener_cargues():
    logging.info("Solicitud GET recibida en /cargues")
    try:
        cargue = request.args.get('CARGUE')
        fecha_salida_cargue = request.args.get('FECHASALIDACARGUE')

        query = "SELECT * FROM cargues WHERE 1=1"
        params = []

        if cargue:
            query += " AND CARGUE LIKE %s"
            params.append(f"%{cargue}%")
        if fecha_salida_cargue:
            query += " AND FECHASALIDACARGUE = %s"
            params.append(fecha_salida_cargue)

        logging.info(f"Ejecutando consulta: {query} | Parámetros: {params}")

        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute(query, params)
        cargues = cur.fetchall()

        if not cargues:
            logging.info("No se encontraron resultados para la consulta.")
            return jsonify({"message": "No se encontraron cargues"}), 404

        return jsonify(cargues), 200

    except Exception as e:
        logging.exception("Error al obtener cargues")
        return error_response(f"Error interno del servidor: {str(e)}", 500)

    finally:
        try:
            cur.close()
            conn.close()
        except Exception:
            pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6010, debug=True)