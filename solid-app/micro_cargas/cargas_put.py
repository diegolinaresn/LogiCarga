from flask import Flask, request, jsonify
import logging
from db_config import DB_CONFIG
from utils import setup_logging, error_response
import mysql.connector

app = Flask(__name__)

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

setup_logging()

@app.route('/cargues', methods=['PUT'])
def actualizar_cargues():
    logging.info("Solicitud PUT recibida en /cargues")
    try:
        data = request.get_json()
        if not data or "cargues" not in data:
            return error_response("Se espera una lista de cargues en el formato adecuado", 400)

        cargues = data.get("cargues")
        conn = get_connection()
        cur = conn.cursor()

        for cargue in cargues:
            cur.execute("""
                UPDATE cargues
                SET CARGUE = %s, FECHASALIDACARGUE = %s, HORA_SALIDA_CARGUE = %s, HORAS_ESPERA_CARGUE = %s, HORAS_CARGUE = %s
                WHERE CODIGO_CARGUE = %s
            """, (
                cargue.get('CARGUE'),
                cargue.get('FECHASALIDACARGUE'),
                cargue.get('HORA_SALIDA_CARGUE'),
                cargue.get('HORAS_ESPERA_CARGUE'),
                cargue.get('HORAS_CARGUE'),
                cargue.get('CODIGO_CARGUE')
            ))

        conn.commit()
        return jsonify({"message": "Cargues actualizados exitosamente"}), 200

    except Exception as e:
        logging.exception("Error al actualizar cargues")
        return error_response(f"Error interno del servidor: {str(e)}", 500)

    finally:
        try:
            cur.close()
            conn.close()
        except Exception:
            pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6005, debug=True)
