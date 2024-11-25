from flask import Flask, request, jsonify
import mysql.connector
from db_config import DB_CONFIG
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/api/clients', methods=['POST'])
def create_client():
    data = request.json
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        INSERT INTO clientes (Cliente, Nombre_1, Nombre_2, Calle, Telefono_1, Poblacion)
        VALUES (%s, %s, %s, %s, %s, %s);
        """
        values = (data.get('Cliente'), data.get('Nombre_1'), data.get('Nombre_2'),
                data.get('Calle'), data.get('Telefono_1'), data.get('Poblacion'))
        cursor.execute(query, values)

        conn.commit()

        return jsonify({"message": "Cliente creado exitosamente"}), 201
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(port=7001, debug=True)
