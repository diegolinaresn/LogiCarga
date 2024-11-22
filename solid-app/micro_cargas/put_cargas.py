from flask import Flask, request, jsonify
import logging
from db_config import init_mysql
from utils import setup_logging, error_response

app = Flask(__name__)
mysql = init_mysql(app)
setup_logging()

@app.route('/cargas', methods=['PUT'])
def actualizar_cargas():
    logging.info("Solicitud PUT recibida en /cargas")
    try:
        data = request.get_json()
        if not data or "cargas" not in data:
            logging.error("Falta el cuerpo de la solicitud o no contiene 'cargas'")
            return error_response("Se espera una lista de cargas en el formato adecuado", 400)

        cargas = data.get("cargas")
        cur = mysql.connection.cursor()

        for carga in cargas:
            carga_id = carga.get('carga_id')
            nombre = carga.get('nombre')
            estado = carga.get('estado')

            if not carga_id or not nombre or not estado:
                logging.error("Faltan datos en la carga")
                return error_response("Cada carga debe tener 'carga_id', 'nombre' y 'estado'", 400)

            cur.execute("""
                UPDATE cargas
                SET nombre = %s, estado = %s
                WHERE carga_id = %s
            """, (nombre, estado, carga_id))
            if cur.rowcount == 0:
                return error_response(f"No se encontró una carga con carga_id {carga_id}", 404)

        mysql.connection.commit()
        return jsonify({"message": "Cargas actualizadas exitosamente"}), 200

    except Exception as e:
        mysql.connection.rollback()
        logging.exception("Error al actualizar las cargas")
        return error_response(f"Error interno del servidor: {str(e)}", 500)

    finally:
        cur.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6005, debug=True)