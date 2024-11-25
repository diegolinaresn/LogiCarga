from flask import Flask, request, jsonify
import logging
from db_config import DB_CONFIG
from utils import setup_logging, error_response
import mysql.connector

app = Flask(__name__)

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

setup_logging()

@app.route('/cargues', methods=['DELETE'])
def borrar_cargues():
    logging.info("Solicitud DELETE recibida en /cargues")
    try:
        data = request.get_json()
        if not data or "CODIGO_CARGUE" not in data:
            logging.error("Falta el cuerpo de la solicitud o no contiene 'CODIGO_CARGUE'")
            return error_response("Se espera 'CODIGO_CARGUE' o una lista de 'CODIGO_CARGUE' para eliminar cargues", 400)

        codigos_cargue = data.get("CODIGO_CARGUE")
        if isinstance(codigos_cargue, int):
            codigos_cargue = [codigos_cargue]

        conn = get_connection()
        cur = conn.cursor()
        for codigo_cargue in codigos_cargue:
            cur.execute("DELETE FROM cargues WHERE CODIGO_CARGUE = %s", (codigo_cargue,))
            if cur.rowcount == 0:
                return error_response(f"No se encontró un cargue con CODIGO_CARGUE {codigo_cargue}", 404)

        conn.commit()
        return jsonify({"message": "Cargues eliminados exitosamente"}), 200

    except Exception as e:
        logging.exception("Error al eliminar cargues")
        return error_response(f"Error interno del servidor: {str(e)}", 500)

    finally:
        try:
            cur.close()
            conn.close()
        except NameError:
            pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6008, debug=True)
