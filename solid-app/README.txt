Requisitos Previos
Node.js (v16 o superior).
Python (v3.8 o superior).
Un entorno de base de datos dentro de una instancia de Google Cloud SQL
Instancia de maquina virtual de Gcloud compute



Primeramente instalar todas las dependencias (front-end)
cd solid-app (entrar a la carpeta del proyecto)
npm install

Para extraer el Back-end:
Pasar el zip de su computadora a la instancia
gcloud compute scp DirectorioDondeSeEncuentra -NombreDeLaInstancia:DireccionDirectorioAPoner 

Una vez ya extraído todo, en una terminal de la instancia donde se ponga el backend, correr:
pip install werkzeug
pip install mysql-connector-python
pip install requests
pip install matplotlib
pip install flask
pip install flask-cors
pip install python-jose

.env modificar la variable MYSQL_HOST=PonerValorInstanciaSQL

Asegurarse de abrir los puertos en gcloud compute y en firewall cmd con las banderas de --zone=public --permanent
5001, 5005, 5010, 5011, 6001, 6005, 6008, 6010, 7000, 7001, 7002 y 7003

Se deben de prender los microservicios de la siguiente manera:
python main.py

Entrar a la carpeta solid-app/utils/Api.js, y cambiar la IP a la instancia de gcloud compute

En una terminal ejecutar el Servidor de Desarrollo
cd solid-app
npm run dev

POSIBLES ERRORES:
Confirmar haber instalado todas las dependencias mencionadas