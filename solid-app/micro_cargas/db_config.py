from flask_mysqldb import MySQL

def init_mysql(app):
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = '111'  
    app.config['MYSQL_DB'] = 'cargas_db'
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
    return MySQL(app)