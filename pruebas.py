import mysql.connector

def conectar_y_consultar():
    try:
        # Configuración de la conexión
        conexion = mysql.connector.connect(
            host="localhost",          # Host local
            user="root",               # Usuario de MySQL
            password="6666",  # Contraseña de MySQL
            database="cargas"          # Nombre de la base de datos
        )
        
        # Verificar conexión
        if conexion.is_connected():
            print("Conexión exitosa a la base de datos")

        # Crear un cursor para ejecutar consultas
        cursor = conexion.cursor()

        # Consulta: Mostrar las primeras 5 filas de la tabla `tramos`
        consulta = "SELECT * FROM tramos LIMIT 5;"
        cursor.execute(consulta)

        # Obtener los resultados
        resultados = cursor.fetchall()
        print("Resultados de la consulta:")
        for fila in resultados:
            print(fila)

    except mysql.connector.Error as e:
        print(f"Error al conectar o ejecutar la consulta: {e}")

    finally:
        if conexion.is_connected():
            cursor.close()
            conexion.close()
            print("Conexión cerrada.")

# Ejecutar la función
conectar_y_consultar()
