import os # para saber la ruta absoluta de la db si no la encontramos
from flask import Flask, request, jsonify # Para endpoints
from flask_bcrypt import Bcrypt  # para encriptar y comparar
from flask_jwt_extended import  JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from admin_bp import admin_bp                       # Acá importamos rutas admin
from public_bp import public_bp                     # Acá importamos rutas public
from database import db                             # Acá importamos la base de datos inicializada
from flask_migrate import Migrate

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
# ENCRIPTACION JWT y BCRYPT-------

#app.config["JWT_SECRET_KEY"] = "valor-variable"  # clave secreta para firmar los tokens.( y a futuro va en un archivo .env)
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY', 'fallback_secret')
jwt = JWTManager(app)  # isntanciamos jwt de JWTManager utilizando app para tener las herramientas de encriptacion.
bcrypt = Bcrypt(app)   # para encriptar password


# REGISTRAR BLUEPRINTS ( POSIBILIDAD DE UTILIZAR EL ENTORNO DE LA app EN OTROS ARCHIVOS Y GENERAR RUTAS EN LOS MISMOS )
app.register_blueprint(admin_bp, url_prefix='/admin')  # poder registrarlo como un blueprint ( parte del app )
app.register_blueprint(public_bp, url_prefix='/public')  # blueprint public_bp
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# DATABASE---------------
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance', 'mydatabase.db')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
#app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f'sqlite:///{db_path}')


db.init_app(app)
migrate = Migrate(app, db)

print(f"Ruta de la base de datos: {db_path}")
print(f"Base de datos URI: {app.config['SQLALCHEMY_DATABASE_URI']}")



if not os.path.exists(os.path.dirname(db_path)): # Nos aseguramos que se cree carpeta instance automatico para poder tener mydatabase.db dentro.
    os.makedirs(os.path.dirname(db_path))


# AL FINAL ( detecta que encendimos el servidor desde terminal y nos da detalles de los errores )
if __name__ == '__main__':
    app.run(debug=os.getenv('DEBUG', False), host=os.getenv('FLASK_RUN_HOST', '0.0.0.0'), port=os.getenv('FLASK_RUN_PORT', 5000))