from flask import Flask, jsonify, request
import logging
from db_config import init_mysql
from utils import setup_logging, error_response

# Configuración inicial de Flask y MySQL
app = Flask(__name__)
mysql = init_mysql(app)
setup_logging()

@app.route('/cargas', methods=['GET'])
def obtener_cargas():
    """
    Endpoint para obtener cargas de la base de datos.
    Permite filtrar por nombre y estado.
    """
    logging.info("Solicitud GET recibida en /cargas")
    try:
        # Obtener parámetros de la solicitud
        nombre = request.args.get('nombre')
        estado = request.args.get('estado')

        # Construir consulta SQL
        query = "SELECT * FROM cargas WHERE 1=1"
        params = []

        if nombre:
            query += " AND nombre LIKE %s"
            params.append(f"%{nombre}%")
        if estado:
            query += " AND estado = %s"
            params.append(estado)

        logging.info(f"Ejecutando consulta: {query} | Parámetros: {params}")

        # Ejecutar consulta
        cur = mysql.connection.cursor()
        cur.execute(query, params)
        cargas = cur.fetchall()

        # Si no hay resultados
        if not cargas:
            logging.info("No se encontraron resultados para la consulta.")
            return jsonify({"message": "No se encontraron cargas"}), 404

        # Construir respuesta JSON usando diccionarios
        resultado = [
            {
                "carga_id": c["carga_id"],
                "nombre": c["nombre"],
                "descripcion": c["descripcion"],
                "peso": float(c["peso"]) if c["peso"] is not None else 0.0,
                "estado": c["estado"]
            }
            for c in cargas
        ]

        logging.info(f"Resultados obtenidos: {resultado}")
        return jsonify(resultado), 200

    except Exception as e:
        # Registrar errores
        logging.error(f"Error al ejecutar la consulta: {query} | Parámetros: {params}")
        logging.exception(f"Excepción: {str(e)}")
        return error_response(f"Error interno del servidor: {str(e)}", 500)

    finally:
        # Cerrar cursor
        try:
            cur.close()
        except Exception as e:
            logging.error(f"Error al cerrar el cursor: {str(e)}")

@app.route('/test_db', methods=['GET'])
def test_db():
    """
    Endpoint para probar la conexión a la base de datos.
    """
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT 1")
        result = cur.fetchone()
        logging.info("Conexión a la base de datos exitosa.")
        return jsonify({"message": "Conexión exitosa", "result": result}), 200
    except Exception as e:
        logging.exception(f"Error en la conexión a la base de datos: {str(e)}")
        return jsonify({"error": f"Error al conectar con la base de datos: {str(
e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)