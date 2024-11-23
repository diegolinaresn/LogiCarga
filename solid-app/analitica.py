from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import matplotlib.pyplot as plt
import io
import base64

app_analytics = Flask(__name__)
CORS(app_analytics)

# Configuración de la base de datos
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "6666",
    "database": "cargas"
}

@app_analytics.route('/analytics/efficiency', methods=['GET'])
def efficiency():
    """Eficiencia promedio por mes y TOP 5 meses más eficientes."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        SELECT MONTH(c.FECHASALIDACARGUE) AS month, YEAR(c.FECHASALIDACARGUE) AS year,
               AVG(TIMESTAMPDIFF(HOUR, CONCAT(c.FECHASALIDACARGUE, ' ', c.HORA_SALIDA_CARGUE),
                                 CONCAT(d.FECHALLEGADADESCARGUE, ' ', d.HORA_LLEGADA_DESCARGUE))) AS avg_hours
        FROM Cargues c
        INNER JOIN Descargues d ON c.CODIGO_CARGUE = d.CODIGO_DESCARGUE
        WHERE c.FECHASALIDACARGUE IS NOT NULL AND c.HORA_SALIDA_CARGUE IS NOT NULL 
          AND d.FECHALLEGADADESCARGUE IS NOT NULL AND d.HORA_LLEGADA_DESCARGUE IS NOT NULL
        GROUP BY year, month
        ORDER BY avg_hours ASC
        LIMIT 5;
        """
        cursor.execute(query)
        results = cursor.fetchall()

        return jsonify({
            "top_5_efficient_months": [{"month": row[0], "year": row[1], "avg_hours": round(row[2], 2)} for row in results]
        })

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)})
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

@app_analytics.route('/analytics/economic_loss', methods=['GET'])
def economic_loss():
    """Pérdidas económicas promedio por sector y TOP 5 sectores con mayores pérdidas."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        SELECT c.DESCRIPCION, SUM(o.VALOR_PACTADO - o.VALOR_PAGADO) AS total_loss, 
               AVG(o.VALOR_PACTADO - o.VALOR_PAGADO) AS avg_loss
        FROM Operaciones o
        INNER JOIN Cierres c ON o.codigo_via = c.codigo_via
        WHERE o.VALOR_PACTADO > o.VALOR_PAGADO 
          AND o.VALOR_PACTADO IS NOT NULL AND o.VALOR_PAGADO IS NOT NULL 
          AND c.DESCRIPCION IS NOT NULL
        GROUP BY c.DESCRIPCION
        ORDER BY total_loss DESC
        LIMIT 5;
        """
        cursor.execute(query)
        results = cursor.fetchall()

        return jsonify({
            "top_5_losses": [{"sector": row[0], "total_loss": round(row[1], 2), "avg_loss": round(row[2], 2)} for row in results]
        })

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)})
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

@app_analytics.route('/analytics/risk_analysis', methods=['GET'])
def risk_analysis():
    """TOP 5 tramos más riesgosos por bloqueos y longitud afectada."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        SELECT t.tramo, t.sector, t.length_km, COUNT(c.cod_tramo) AS num_bloqueos, 
               SUM(t.length_km) AS total_length_affected
        FROM Tramos t
        LEFT JOIN Cierres c ON t.cod_tramo = c.cod_tramo
        WHERE t.tramo IS NOT NULL AND t.sector IS NOT NULL AND t.length_km IS NOT NULL
        GROUP BY t.cod_tramo
        ORDER BY num_bloqueos DESC
        LIMIT 5;
        """
        cursor.execute(query)
        results = cursor.fetchall()

        return jsonify({
            "top_5_risks": [
                {
                    "tramo": row[0],
                    "sector": row[1],
                    "length_km": row[2],
                    "num_bloqueos": row[3],
                    "total_length_affected": round(row[4], 2),
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

@app_analytics.route('/analytics/visualization', methods=['GET'])
def visualization():
    """Generar gráfico de los 5 sectores con mayores pérdidas económicas."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        SELECT c.DESCRIPCION, SUM(o.VALOR_PACTADO - o.VALOR_PAGADO) AS total_loss
        FROM Operaciones o
        INNER JOIN Cierres c ON o.codigo_via = c.codigo_via
        WHERE o.VALOR_PACTADO > o.VALOR_PAGADO 
          AND o.VALOR_PACTADO IS NOT NULL AND o.VALOR_PAGADO IS NOT NULL 
          AND c.DESCRIPCION IS NOT NULL
        GROUP BY c.DESCRIPCION
        ORDER BY total_loss DESC
        LIMIT 5;
        """
        cursor.execute(query)
        results = cursor.fetchall()

        # Generar gráfico
        sectors = [row[0] for row in results]
        losses = [row[1] for row in results]

        plt.figure(figsize=(10, 6))
        plt.bar(sectors, losses, color='red')
        plt.xlabel('Sector')
        plt.ylabel('Pérdidas Económicas')
        plt.title('TOP 5 Sectores con Mayores Pérdidas')
        plt.xticks(rotation=45)

        # Guardar el gráfico en base64
        img = io.BytesIO()
        plt.savefig(img, format='png', bbox_inches='tight')
        img.seek(0)
        img_base64 = base64.b64encode(img.getvalue()).decode()

        return jsonify({"chart": img_base64})

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)})
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app_analytics.run(port=5010, debug=True)
