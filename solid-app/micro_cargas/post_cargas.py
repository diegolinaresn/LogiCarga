from flask import Flask, request, jsonify
import logging
from db_config import init_mysql
from utils import setup_logging, error_response

app = Flask(__name__)

mysql = init_mysql(app)

setup_logging()

@app.route('/cargas', methods=['POST'])
def crear_cargas():
    """
    Endpoint para crear nuevas cargas en la base de datos.
    Recibe un JSON con una lista de cargas y las inserta en la base de datos.
    """
    logging.info("Solicitud POST recibida en /cargas")
    
    try:
        # Obtiene los datos enviados en el cuerpo de la solicitud
        data = request.get_json()
        if not data or "cargas" not in data:
            logging.error("Falta el cuerpo de la solicitud o no contiene 'cargas'")
            return error_response("Se espera una lista de cargas en el formato adecuado", 400)
        
        cargas = data.get("cargas")
        if not isinstance(cargas, list):
            logging.error("El campo 'cargas' no es una lista")
            return error_response("El campo 'cargas' debe ser una lista", 400)

        # Conexión a la base de datos
        cur = mysql.connection.cursor()

        # Inserta cada carga en la base de datos
        for carga in cargas:
            nombre = carga.get('nombre')
            descripcion = carga.get('descripcion', '')
            peso = carga.get('peso', 0)
            estado = carga.get('estado', 'pendiente')

            # Validaciones básicas
            if not nombre:
                logging.error("Falta el campo 'nombre' en una de las cargas")
                return error_response("Cada carga debe tener un 'nombre'", 400)

            # Inserción en la tabla 'cargas'
            cur.execute("""
                INSERT INTO cargas (nombre, descripcion, peso, estado)
                VALUES (%s, %s, %s, %s)
            """, (nombre, descripcion, peso, estado))
            mysql.connection.commit()

        logging.info("Cargas insertadas correctamente en la base de datos")
        return jsonify({"message": "Cargas creadas exitosamente"}), 201

    except Exception as e:
        mysql.connection.rollback()
        logging.exception("Error al crear las cargas")
        return error_response(f"Error interno del servidor: {str(e)}", 500)

    finally:
        cur.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6001, debug=True)