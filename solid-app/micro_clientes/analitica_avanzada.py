from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import matplotlib.pyplot as plt
import io
import base64
from db_config import DB_CONFIG  # Importar configuración de la base de datos



app_analitica_avanzada = Flask(__name__)
CORS(app_analitica_avanzada)

# Configuración de la base de datos

@app_analitica_avanzada.route('/analytics/delivery_efficiency', methods=['GET'])
def delivery_efficiency():
    """Gráfico de líneas: Número de entregas realizadas por semana."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        SELECT WEEK(c.FECHASALIDACARGUE) AS week, 
               YEAR(c.FECHASALIDACARGUE) AS year,
               COUNT(*) AS total_deliveries
        FROM cargues c
        INNER JOIN descargues d ON c.CODIGO_CARGUE = d.CODIGO_DESCARGUE
        WHERE c.FECHASALIDACARGUE IS NOT NULL 
          AND d.FECHALLEGADADESCARGUE IS NOT NULL
        GROUP BY year, week
        ORDER BY year, week;
        """
        cursor.execute(query)
        results = cursor.fetchall()

        return jsonify({
            "delivery_efficiency": [
                {
                    "week": row[0],
                    "year": row[1],
                    "total_deliveries": row[2]
                }
                for row in results
            ]
        })

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)})
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

@app_analitica_avanzada.route('/analytics/economic_losses', methods=['GET'])
def economic_losses():
    """Gráfico de barras: Pérdidas económicas por productos y rutas afectadas."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        SELECT p.NATURALEZA AS product_type, c.DESCRIPCION AS sector,
               SUM(o.VALOR_PACTADO - o.VALOR_PAGADO) AS total_loss
        FROM operaciones o
        INNER JOIN cierres c ON o.codigo_via = c.codigo_via
        INNER JOIN productos p ON o.COD_PRODUCTO = p.COD_PRODUCTO
        WHERE o.VALOR_PACTADO > o.VALOR_PAGADO
        GROUP BY product_type, sector
        ORDER BY total_loss DESC;
        """
        cursor.execute(query)
        results = cursor.fetchall()

        data = {}
        for row in results:
            product_type = row[0]
            sector = row[1]
            total_loss = row[2]

            if product_type not in data:
                data[product_type] = []
            data[product_type].append({"sector": sector, "total_loss": round(total_loss, 2)})

        return jsonify({"economic_losses": data})

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)})
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

@app_analitica_avanzada.route('/analytics/risk_heatmap', methods=['GET'])
def risk_heatmap():
    """Mapa de calor: Áreas de alto riesgo."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        SELECT t.sector, AVG(c.LAT) AS avg_lat, AVG(c.LON) AS avg_long, COUNT(c.cod_tramo) AS num_bloqueos
        FROM tramos t
        LEFT JOIN cierres c ON t.cod_tramo = c.cod_tramo
        GROUP BY t.sector
        ORDER BY num_bloqueos DESC;
        """
        cursor.execute(query)
        results = cursor.fetchall()

        heatmap_data = [{"sector": row[0], "avg_lat": row[1], "avg_long": row[2], "num_bloqueos": row[3]} for row in results]

        # Crear gráfico de dispersión
        latitudes = [row[1] for row in results]
        longitudes = [row[2] for row in results]
        bloqueos = [row[3] for row in results]

        plt.figure(figsize=(10, 6))
        plt.scatter(longitudes, latitudes, c=bloqueos, cmap="Reds", s=100)
        plt.colorbar(label="Número de Bloqueos")
        plt.title("Mapa de Calor: Áreas de Alto Riesgo")
        plt.xlabel("Longitud")
        plt.ylabel("Latitud")

        img = io.BytesIO()
        plt.savefig(img, format='png', bbox_inches='tight')
        img.seek(0)
        img_base64 = base64.b64encode(img.getvalue()).decode()

        return jsonify({"heatmap_data": heatmap_data, "heatmap_image": img_base64})

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)})
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app_analitica_avanzada.run(port=5011, debug=True)