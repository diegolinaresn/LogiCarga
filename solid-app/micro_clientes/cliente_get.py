from flask import Flask, jsonify, request
import mysql.connector
from db_config import DB_CONFIG
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/api/clients', methods=['GET'])
def get_clients():
    limit = request.args.get('limit', 20000, type=int)
    offset = request.args.get('offset', 0, type=int)
    search = request.args.get('search', '', type=str)

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        if search.isdigit():  # Buscar por ID si el término es numérico
            query = """
            SELECT c.Cliente, c.Nombre_1, c.Nombre_2, c.Telefono_1, c.Poblacion, c.Calle
            FROM clientes c
            WHERE c.Cliente = %s;
            """
            cursor.execute(query, (search,))
        else:  # Buscar por otros campos
            query = """
            SELECT c.Cliente, c.Nombre_1, c.Nombre_2, c.Telefono_1, c.Poblacion, c.Calle
            FROM clientes c
            WHERE c.Nombre_1 LIKE %s OR c.Telefono_1 LIKE %s OR c.Poblacion LIKE %s
            LIMIT %s OFFSET %s;
            """
            search_query = f"%{search}%"
            cursor.execute(query, (search_query, search_query, search_query, limit, offset))

        results = cursor.fetchall()
        return jsonify(results)
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(port=7000, debug=True)