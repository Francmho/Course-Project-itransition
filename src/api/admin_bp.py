from flask import request, jsonify, Blueprint
from flask.views import MethodView
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import User
from database import db
from datetime import timedelta, datetime

admin_bp = Blueprint('admin', __name__)
bcrypt = Bcrypt()
jwt = JWTManager()

class Register(MethodView):
    def post(self):
        # Ruta para registrar usuario
        email = request.json.get('email')
        password = request.json.get('password')
        name = request.json.get('name')
        if not email or not password or not name:
            return jsonify({'error': 'Email, password and Name are required.'}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already exists.'}), 409

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(email=email, password=password_hash, name=name)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully.'}), 201

class Login(MethodView):
    def post(self):
        # Ruta para obtener token
        email = request.json.get('email')
        password = request.json.get('password')
        if not email or not password:
            return jsonify({'error': 'Email and password are required.'}), 400
        
        login_user = User.query.filter_by(email=email).one()
        if bcrypt.check_password_hash(login_user.password, password):
            expires = timedelta(minutes=30)
            access_token = create_access_token(identity=login_user.id, expires_delta=expires)
            return jsonify({'access_token': access_token}), 200
        else:
            return jsonify({"error": "Invalid password."}), 401

class AdminUsers(MethodView):
    @jwt_required()
    def get(self):
        # Ruta restringida para obtener usuarios admin
        current_user_id = get_jwt_identity()
        if current_user_id:
            users = User.query.all()
            user_list = [{'id': user.id, 'username': user.name, 'email': user.email, 'is_blocked': user.is_blocked} for user in users]
            return jsonify(user_list), 200
        else:
            return jsonify({"error": "Invalid or missing token."}), 401

# Register the views
admin_bp.add_url_rule('/register', view_func=Register.as_view('register'))
admin_bp.add_url_rule('/login', view_func=Login.as_view('login'))
admin_bp.add_url_rule('/users', view_func=AdminUsers.as_view('admin_users'))





# from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
# from flask.views import MethodView
# from flask_bcrypt import Bcrypt                                  # Bcrypt para encriptación
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity   # Jwt para tokens
# from models import User                                          # importar tabla "User" de models
# from database import db                                          # importa la db desde database.py
# from datetime import timedelta, datetime                                   # importa tiempo especifico para rendimiento de token válido

# admin_bp = Blueprint('admin', __name__)     # instanciar admin_bp desde clase Blueprint para crear las rutas.

# bcrypt = Bcrypt()
# jwt = JWTManager()




# # RUTA TEST de http://127.0.0.1:5000/admin_bp que muestra "Hola mundo":
# @admin_bp.route('/', methods=['GET'])
# def show_hello_world():
#      return "Hola mundo",200


# # RUTA CREAR USUARIO
# @admin_bp.route('/users', methods=['POST'])
# def create_user():
#     try:
#         email = request.json.get('email')
#         password = request.json.get('password')
#         name = request.json.get('name')

#         if not email or not password or not name:
#             return jsonify({'error': 'Email, password and Name are required.'}), 400

#         existing_user = User.query.filter_by(email=email).first()
#         if existing_user:
#             return jsonify({'error': 'Email already exists.'}), 409

#         password_hash = bcrypt.generate_password_hash(password).decode('utf-8')


#         # Ensamblamos el usuario nuevo
#         new_user = User(email=email, password=password_hash, name=name)


#         db.session.add(new_user)
#         db.session.commit()

#         good_to_share_user = {
#             'id': new_user.id,
#             'name':new_user.name,
#             'email':new_user.email
#         }

#         return jsonify({'message': 'User created successfully.','user_created':good_to_share_user}), 201

#     except Exception as e:
#         return jsonify({'error': 'Error in user creation: ' + str(e)}), 500


# #RUTA LOG-IN ( CON TOKEN DE RESPUESTA )
# @admin_bp.route('/token', methods=['POST'])
# def get_token():
#     try:
#         #  Primero chequeamos que por el body venga la info necesaria:
#         email = request.json.get('email')
#         password = request.json.get('password')

#         if not email or not password:
#             return jsonify({'error': 'Email and password are required.'}), 400
        
#         # Buscamos al usuario con ese correo electronico ( si lo encuentra lo guarda ):
#         login_user = User.query.filter_by(email=request.json['email']).one()

#         # Verificamos que el password sea correcto:
#         password_from_db = login_user.password #  Si loguin_user está vacio, da error y se va al "Except".
#         true_o_false = bcrypt.check_password_hash(password_from_db, password)
        
#         # Si es verdadero generamos un token y lo devuelve en una respuesta JSON:
#         if true_o_false:
#             login_user.last_login = datetime.utcnow()  # O también puedes usar .timestamp() si prefieres milisegundos
#             db.session.commit() 

#             expires = timedelta(minutes=30)  # pueden ser "hours", "minutes", "days","seconds"
#             user_id = login_user.id       # recuperamos el id del usuario para crear el token...
#             access_token = create_access_token(identity=user_id, expires_delta=expires)   # creamos el token con tiempo vencimiento
#             return jsonify({ 'access_token':access_token}), 200  # Enviamos el token al front ( si es necesario serializamos el "login_user" y tambien lo enviamos en el objeto json )

#         else:
#             return {"Error":"Contraseña  incorrecta"}
    
#     except Exception as e:
#         return {"Error":"El email proporcionado no corresponde a ninguno registrado: " + str(e)}, 500
    
# # EJEMPLO DE RUTA RESTRINGIDA POR TOKEN. ( LA MISMA RECUPERA TODOS LOS USERS Y LO ENVIA PARA QUIEN ESTÉ LOGUEADO )
    
# @admin_bp.route('/users')
# @jwt_required()  # Decorador para requerir autenticación con JWT
# def show_users():
#     current_user_id = get_jwt_identity()  # Obtiene la id del usuario del token
#     if current_user_id:
#         users = User.query.all()
#         user_list = []
#         for user in users:
#             user_dict = {
#                 'id': user.id,
#                 'username': user.name,
#                 'email': user.email,
#                 'is_blocked': user.is_blocked
#             }
#             user_list.append(user_dict)
#         return jsonify(user_list), 200
#     else:
#         return {"Error": "Token inválido o no proporcionado"}, 401

