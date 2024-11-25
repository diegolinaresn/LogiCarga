import logging
from flask import jsonify

def setup_logging():
    """
    Configura el registro de eventos del sistema.
    """
    logging.basicConfig(
        level=logging.INFO, 
        format='%(asctime)s - %(levelname)s - %(message)s'
    )


def error_response(message, status_code=500):
    """
    Genera una respuesta de error estandarizada para la API.
    
    Args:
        message (str): Mensaje de error a enviar al cliente.
        status_code (int): Código de estado HTTP. Por defecto es 500.
    
    Returns:
        Response: Respuesta en formato JSON con el error.
    """
    response = {
        "error": message,
        "status_code": status_code
    }
    return jsonify(response), status_code