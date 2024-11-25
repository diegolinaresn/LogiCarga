from flask import Flask, request, jsonify
import logging
from db_config import DB_CONFIG
from utils import setup_logging, error_response
import mysql.connector

app = Flask(__name__)

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

setup_logging()

@app.route('/cargues', methods=['POST'])
def crear_cargues():
    logging.info("Solicitud POST recibida en /cargues")
    try:
        data = request.get_json()
        if not data or "cargues" not in data:
            return error_response("Se espera una lista de cargues en el formato adecuado", 400)

        cargues = data.get("cargues")
        conn = get_connection()
        cur = conn.cursor()

        for cargue in cargues:
            cur.execute("""
                INSERT INTO cargues (CODIGO_CARGUE, CARGUE, FECHASALIDACARGUE, HORA_SALIDA_CARGUE, HORAS_ESPERA_CARGUE, HORAS_CARGUE)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                cargue.get('CODIGO_CARGUE'),
                cargue.get('CARGUE', ''),
                cargue.get('FECHASALIDACARGUE'),
                cargue.get('HORA_SALIDA_CARGUE', ''),
                cargue.get('HORAS_ESPERA_CARGUE', 0.0),
                cargue.get('HORAS_CARGUE', 0.0),
            ))

        conn.commit()
        return jsonify({"message": "Cargues creados exitosamente"}), 201

    except Exception as e:
        logging.exception("Error al crear cargues")
        return error_response(f"Error interno del servidor: {str(e)}", 500)

    finally:
        try:
            cur.close()
            conn.close()
        except Exception:
            pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6001, debug=True)
