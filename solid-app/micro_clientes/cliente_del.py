from flask import Flask, jsonify
import mysql.connector
from db_config import DB_CONFIG
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/api/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = "DELETE FROM clientes WHERE Cliente = %s"
        cursor.execute(query, (client_id,))
        conn.commit()

        return jsonify({"message": "Cliente eliminado exitosamente"})
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(port=7003, debug=True)
