from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from datetime import datetime

# Configuración
app = Flask(__name__)
CORS(app)  # Habilitar CORS para toda la aplicación

# Base de datos simulada
fake_users_db = {}

# Endpoint para registrar un nuevo usuario
@app.route("/register", methods=["POST"])
def register():
    try:
        # Recibir datos como JSON
        data = request.json
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        # Validar que los datos estén completos
        if not email or not username or not password:
            return jsonify({"error": "Missing required fields"}), 400

        # Verificar que el usuario no exista
        if email in fake_users_db:
            return jsonify({"error": "User already exists"}), 400

        # Crear usuario y guardar en la base de datos simulada
        hashed_password = generate_password_hash(password)
        fake_users_db[email] = {
            "username": username,
            "email": email,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow().isoformat(),
        }

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Server error"}), 500

# Iniciar la aplicación en el puerto 5006
if __name__ == "__main__":
    app.run(port=5006)
