import threading
import subprocess

# Lista de servicios a iniciar
services = [
    {"name": "analitica_avanzada", "file": "analitica_avanzada.py"},
    {"name": "analitica", "file": "analitica.py"},
    {"name": "auth", "file": "auth.py"},
    {"name": "authregister", "file": "authregister.py"},
    {"name": "map_service", "file": "map_service.py"},
]

# Función para ejecutar un servicio
def run_service(service_name, service_file):
    try:
        print(f"Iniciando {service_name} ({service_file})...")
        subprocess.run(["python", service_file], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error al iniciar {service_name}: {e}")
    except FileNotFoundError:
        print(f"No se encontró el archivo {service_file}.")

# Crear un hilo para cada servicio
threads = []
for service in services:
    thread = threading.Thread(target=run_service, args=(service["name"], service["file"]))
    threads.append(thread)

# Iniciar todos los hilos
for thread in threads:
    thread.start()

# Esperar a que todos los hilos finalicen
for thread in threads:
    thread.join()

print("Todos los servicios han finalizado.")
