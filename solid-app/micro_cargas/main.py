import subprocess
import signal
import sys

processes = []

def run_service(file, port):
    print(f"Iniciando el servicio: {file} en el puerto {port}")
    process = subprocess.Popen(["python", f"{file}.py", str(port)])
    processes.append(process)

def stop_services():
    print("\nDeteniendo todos los servicios...")
    for process in processes:
        try:
            process.terminate()
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            print(f"El proceso {process.pid} no se cerró a tiempo. Forzando cier
re.")
            process.kill()

def signal_handler(sig, frame):
    stop_services()
    sys.exit(0)

def main():
    print("Iniciando el script principal")

    services = [
        {"file": "get_cargas", "port": 6000},
        {"file": "post_cargas", "port": 6001},
        {"file": "delete_cargas", "port": 6008},
        {"file": "put_cargas", "port": 6005},
    ]

    signal.signal(signal.SIGINT, signal_handler)

    for service in services:
        run_service(service["file"], service["port"])

    try:
        signal.pause()
    except AttributeError:
        while True:
            pass

if __name__ == "__main__":
    main()