from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from jose import jwt, JWTError
from datetime import datetime, timedelta

# Configuración
app = Flask(__name__)
CORS(app)  # Habilitar CORS para toda la aplicación
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Base de datos simulada
fake_users_db = {
    "user@example.com": {
        "username": "user",
        "email": "user@example.com",
        "hashed_password": generate_password_hash("password123"),
    },
    "diegopatio@hotmail.com": {
        "username": "diegopatio",
        "email": "diegopatio@hotmail.com",
        "hashed_password": generate_password_hash("user123"),
    },
    "maria@gmail.com": {
        "username": "maria",
        "email": "maria@gmail.com",
        "hashed_password": generate_password_hash("maria456"),
    },
    "john.doe@company.com": {
        "username": "johndoe",
        "email": "john.doe@company.com",
        "hashed_password": generate_password_hash("john789"),
    },
    "admin@website.com": {
        "username": "admin",
        "email": "admin@website.com",
        "hashed_password": generate_password_hash("admin123"),
    },
}

# Crear el token JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Autenticación del usuario
def authenticate_user(email, password):
    user = fake_users_db.get(email)
    if user and check_password_hash(user["hashed_password"], password):
        return user
    return None

# Endpoint para iniciar sesión
@app.route("/token", methods=["POST"])
def login():
    try:
        data = request.form
        print("Datos recibidos:", data)  # Verifica los datos recibidos
        email = data.get("username")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Missing username or password"}), 400

        user = authenticate_user(email, password)
        if not user:
            return jsonify({"error": "Invalid credentials"}), 400

        access_token = create_access_token(data={"sub": user["email"]})
        return jsonify({"access_token": access_token, "token_type": "bearer"})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Server error"}), 500


# Endpoint para obtener datos del usuario autenticado
@app.route("/users/me", methods=["GET"])
def read_users_me():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Token missing"}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            return jsonify({"error": "Invalid token"}), 401
        return jsonify({"email": email})
    except JWTError:
        return jsonify({"error": "Invalid token"}), 401

# Iniciar la aplicación
if __name__ == "__main__":
    app.run(port=5005)
