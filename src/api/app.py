import os 
from flask import Flask, request, jsonify 
from flask_bcrypt import Bcrypt  
from flask_jwt_extended import  JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from admin_bp import admin_bp                     
from public_bp import public_bp                     
from database import db                            
from flask_migrate import Migrate

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# ENCRIPTACION JWT y BCRYPT-------
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY', 'fallback_secret')
jwt = JWTManager(app)  
bcrypt = Bcrypt(app)   


# REGISTRAR BLUEPRINTS ( POSIBILIDAD DE UTILIZAR EL ENTORNO DE LA app EN OTROS ARCHIVOS Y GENERAR RUTAS EN LOS MISMOS )
app.register_blueprint(admin_bp, url_prefix='/admin') 
app.register_blueprint(public_bp, url_prefix='/public')  


# DATABASE---------------
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance', 'mydatabase.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'


db.init_app(app)
migrate = Migrate(app, db, directory='src/api/migrations')


if not os.path.exists(os.path.dirname(db_path)): # Nos aseguramos que se cree carpeta instance automatico para poder tener mydatabase.db dentro.
    os.makedirs(os.path.dirname(db_path))


# AL FINAL ( detecta que encendimos el servidor desde terminal y nos da detalles de los errores )
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
