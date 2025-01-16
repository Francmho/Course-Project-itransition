import os 
from dotenv import load_dotenv
from flask import Flask, request, jsonify,  redirect, url_for, session
from flask_bcrypt import Bcrypt  
from flask_jwt_extended import  JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from admin_bp import admin_bp                     
from public_bp import public_bp  
from salesforce_bp import salesforce_bp                   
from database import db                            
from flask_migrate import Migrate
from authlib.integrations.flask_client import OAuth

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# ENCRIPTACION JWT y BCRYPT-------
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY', 'fallback_secret')
jwt = JWTManager(app)  
bcrypt = Bcrypt(app)   


oauth = OAuth(app)
# Configurar cliente OAuth para Salesforce
#oauth.register_salesforce(salesforce_bp)
oauth.register(
    name='salesforce',
    client_id=os.getenv('CLIENT_ID'),
    client_secret=os.getenv('CLIENT_SECRET'),
    authorize_url='https://login.salesforce.com/services/oauth2/authorize',
    access_token_url='https://login.salesforce.com/services/oauth2/token',
    api_base_url='https://thesocialdys-dev-ed.develop.lightning.force.com/',
    client_kwargs={'scope': 'full'},
    redirect_uri='https://course-project-itransition-hkx7.onrender.com/salesforce/auth/callback'
)

# REGISTRAR BLUEPRINTS ( POSIBILIDAD DE UTILIZAR EL ENTORNO DE LA app EN OTROS ARCHIVOS Y GENERAR RUTAS EN LOS MISMOS )
app.register_blueprint(admin_bp, url_prefix='/admin') 
app.register_blueprint(public_bp, url_prefix='/public')  
app.register_blueprint(salesforce_bp, url_prefix='/salesforce')


# DATABASE---------------
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'instance', 'mydatabase.db')
#app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')


db.init_app(app)
migrate = Migrate(app, db, directory='src/api/migrations')


if not os.path.exists(os.path.dirname(db_path)): # Nos aseguramos que se cree carpeta instance automatico para poder tener mydatabase.db dentro.
    os.makedirs(os.path.dirname(db_path))


print(app.url_map)
# AL FINAL ( detecta que encendimos el servidor desde terminal y nos da detalles de los errores )
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

