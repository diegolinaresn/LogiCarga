import threading
import subprocess

# Función para ejecutar un script en un subproceso
def run_script(script_name):
    try:
        print(f"Iniciando {script_name}...")
        result = subprocess.run(["python", script_name], capture_output=True, text=True)
        print(f"Salida de {script_name}:\n{result.stdout}")
        if result.stderr:
            print(f"Errores en {script_name}:\n{result.stderr}")
    except Exception as e:
        print(f"Error ejecutando {script_name}: {e}")

# Lista de scripts a ejecutar
scripts = ["cliente_get.py", "cliente_post.py", "cliente_put.py", "cliente_del.py"]

# Crear y ejecutar hilos para cada script
threads = []
for script in scripts:
    thread = threading.Thread(target=run_script, args=(script,))
    threads.append(thread)
    thread.start()

# Esperar a que todos los hilos terminen
for thread in threads:
    thread.join()

print("Todos los scripts han terminado de ejecutarse.")
