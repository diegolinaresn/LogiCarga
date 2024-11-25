from flask import Flask, request, jsonify
import mysql.connector
from db_config import DB_CONFIG
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/api/clients/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    data = request.json
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        updates = []
        values = []

        
        if 'Nombre_1' in data:
            updates.append("Nombre_1 = %s")
            values.append(data['Nombre_1'])
        if 'Nombre_2' in data:
            updates.append("Nombre_2 = %s")
            values.append(data['Nombre_2'])
        if 'Telefono_1' in data:
            updates.append("Telefono_1 = %s")
            values.append(data['Telefono_1'])
        if 'Poblacion' in data:
            updates.append("Poblacion = %s")
            values.append(data['Poblacion'])
        if 'Calle' in data:
            updates.append("Calle = %s")
            values.append(data['Calle'])

        values.append(client_id)
        query = f"UPDATE clientes SET {', '.join(updates)} WHERE Cliente = %s"
        cursor.execute(query, tuple(values))
        conn.commit()

        return jsonify({"message": "Cliente actualizado exitosamente"})
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(port=7002, debug=True)
