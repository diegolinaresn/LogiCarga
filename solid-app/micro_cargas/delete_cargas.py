from flask import Flask, request, jsonify
import logging
from db_config import init_mysql
from utils import setup_logging, error_response

app = Flask(__name__)
mysql = init_mysql(app)
setup_logging()

@app.route('/cargas', methods=['DELETE'])
def borrar_cargas():
    logging.info("Solicitud DELETE recibida en /cargas")
    try:
        data = request.get_json()
        if not data or "carga_id" not in data:
            logging.error("Falta el cuerpo de la solicitud o no contiene 'carga_id'")
            return error_response("Se espera 'carga_id' o una lista de 'carga_id' para eliminar cargas", 400)

        carga_ids = data.get("carga_id")
        if isinstance(carga_ids, int):
            carga_ids = [carga_ids]

        cur = mysql.connection.cursor()
        for carga_id in carga_ids:
            cur.execute("DELETE FROM cargas WHERE carga_id = %s", (carga_id,))
            if cur.rowcount == 0:
                return error_response(f"No se encontró una carga con carga_id {carga_id}", 404)

        mysql.connection.commit()
        return jsonify({"message": "Cargas eliminadas exitosamente"}), 200

    except Exception as e:
        mysql.connection.rollback()
        logging.exception("Error al eliminar cargas")
        return error_response(f"Error interno del servidor: {str(e)}", 500)

    finally:
        cur.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6008, debug=True)