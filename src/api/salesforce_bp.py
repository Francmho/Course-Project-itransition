# salesforce_bp.py (Blueprint para las rutas salesforce)
import os 
import requests
from flask import Blueprint, jsonify, redirect, url_for, render_template, session

from flask_jwt_extended import jwt_required, get_jwt_identity
from authlib.integrations.flask_client import OAuth
from models import User
from database import db

import logging
logging.basicConfig(level=logging.DEBUG)

#oauth = OAuth()

salesforce_bp = Blueprint('salesforce', __name__)
oauth = OAuth(salesforce_bp)
salesforce = oauth.create_client('salesforce')

# oauth.register(
#     name='salesforce',
#     client_id='CLIENT_ID',
#     client_secret='CLIENT_SECRET',
#     access_token_url='https://thesocialdys-dev-ed.develop.lightning.force.com/services/oauth2/token',
#     authorize_url='https://thesocialdys-dev-ed.develop.lightning.force.com/services/oauth2/authorize',
#     client_kwargs={'scope': 'api refresh_token'},
#     redirect_uri='https://course-project-itransition-hkx7.onrender.com/salesforce/auth/callback'
# )

@salesforce_bp.route('/')
def home():
    return 'Home Page'

@salesforce_bp.route('/loginSF')
def login_sf():
    logging.debug("Entrando en /loginSF")
    """Redirige al usuario a la página de login de Salesforce"""
    if 'salesforce_token' in session:
        return redirect(url_for('adminpage')) 
    return oauth.salesforce.authorize_redirect(url_for('salesforce.auth_callback', _external=True))


@salesforce_bp.route('/auth/callback')
def auth_callback():
    try:
        token = salesforce.authorize_access_token()
        if not token:
            return jsonify({"error": "Token not found"}), 401
        
        user_info = salesforce.get('https://thesocialdys-dev-ed.develop.lightning.force.com/services/oauth2/userinfo').json()
        if not user_info.get('email'):
            return jsonify({"error": "User email not found in Salesforce data"}), 400 
        
        auth_id = user_info.get('auth_id', None)  # Verifica qué clave contiene el auth_id en la respuesta
        if auth_id:
            print(f"Auth ID: {auth_id}")
        # Guarda el token en la base de datos
        user = User.query.filter_by(email=user_info['email']).first()
        if user:
            user.account_id = auth_id
            user.salesforce_access_token = token['access_token']
            user.salesforce_refresh_token = token.get('refresh_token')
            db.session.commit()
            #return f'Autenticated as {user_info["name"]}'
            return redirect(f"{os.getenv('REACT_APP_API_URL')}/register?name={user_info['name']}&email={user_info['email']}")
            #return redirect(url_for('complete_registration'))
        else:
            return jsonify({"error": "User not found in the database"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
@salesforce_bp.route('/complete_registration', methods=['GET', 'POST'])
@jwt_required() #Poruqe usas esto aqui?
def complete_registration():
    if requests.method == 'POST':
        # Obtener los datos del formulario y guardarlos en la base de datos
        user = User.query.filter_by(email=get_jwt_identity()).first()
        user.city = requests.form.get('city')
        user.zip_code = requests.form.get('zip_code')
        user.phone = requests.form.get('phone')
        db.session.commit()
        return 'Registro completado exitosamente.'

    # Mostrar el formulario en un offcanvas o en una página normal
    return render_template('complete_registration.html')



@salesforce_bp.route('/register', methods=['POST'])
def salesforce_register():
    """Registrar un nuevo usuario en Salesforce"""
    data = requests.json  # Obtener datos del formulario
    salesforce_access_token = get_salesforce_access_token()

    headers = {
        'Authorization': f'Bearer {salesforce_access_token}',
        'Content-Type': 'application/json'
    }
    
    # Datos del nuevo usuario a registrar
    new_user = {
        "FirstName": data['first_name'],
        "LastName": data['last_name'],
        "Email": data['email'],
        "Username": data['username'],
        # Otros campos requeridos por Salesforce
    }

    response = requests.post(
        f'https://thesocialdys-dev-ed.develop.lightning.force.com/services/data/v53.0/sobjects/User',
        headers=headers, json=new_user)

    if response.status_code == 201:
        return jsonify({"message": "Usuario registrado exitosamente en Salesforce"}), 201
    else:
        return jsonify({"error": "No se pudo registrar el usuario en Salesforce"}), response.status_code


#SF GET USERS
@salesforce_bp.route('/users', methods=['GET'])
def get_salesforce_users():
    # Obtener token de Salesforce o refrescarlo si es necesario
    access_token = get_salesforce_access_token()
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    response = requests.get(f'https:thesocialdys-dev-ed.develop.lightning.force.com/services/data/v53.0/sobjects/User', headers=headers)

    if response.status_code == 200:
        users = response.json()
        # Guardar los usuarios en la base de datos
        save_users_to_db(users)
        return jsonify(users)
    else:
        return jsonify({"error": "No se pudieron obtener los usuarios"}), response.status_code

#SF BLOCK/UNBLOCK USERS
@salesforce_bp.route('/users/block_unblock', methods=['POST'])
def block_unblock_users():
    user_ids = requests.json.get('user_ids')  # Lista de IDs de usuarios
    action = requests.json.get('action')  # 'block' o 'unblock'
    salesforce_access_token = get_salesforce_access_token()

    headers = {
        'Authorization': f'Bearer {salesforce_access_token}',
        'Content-Type': 'application/json'
    }

    if action not in ['block', 'unblock']:
        return jsonify({"message": "Action not valid. Use 'block' or 'unblock'."}), 400

    is_active = False if action == 'block' else True

    for user_id in user_ids:
        response = requests.patch(
            f'https://thesocialdys-dev-ed.develop.lightning.force.com/services/data/vXX.X/sobjects/User/{user_id}',
            headers=headers,
            json={'IsActive': is_active}  # Bloquear (False) o Desbloquear (True)
        )
        
        if response.status_code == 204:
            # Actualizar el estado de is_blocked en la base de datos local
            local_user = User.query.filter_by(id=user_id).first()
            if local_user:
                local_user.is_blocked = not is_active  # True si bloqueado, False si desbloqueado
                db.session.commit()
        else:
            return jsonify({"message": f"Error al actualizar el usuario {user_id} en Salesforce."}), response.status_code

    return jsonify({"message": f"Usuarios {'bloqueados' if action == 'block' else 'desbloqueados'} exitosamente"}), 200


#SF DELETE USERS
@salesforce_bp.route('/users/delete', methods=['DELETE'])
def delete_users():
    user_ids = requests.json.get('user_ids')  # Lista de IDs de usuarios a eliminar
    salesforce_access_token = get_salesforce_access_token()

    headers = {
        'Authorization': f'Bearer {salesforce_access_token}',
        'Content-Type': 'application/json'
    }

    for user_id in user_ids:
        response = requests.delete(
            f'https://thesocialdys-dev-ed.develop.lightning.force.com/services/data/v53.0/sobjects/User/{user_id}',
            headers=headers
        )
        
        if response.status_code == 204:
            # Eliminar el usuario de la base de datos local
            local_user = User.query.filter_by(id=user_id).first()
            if local_user:
                db.session.delete(local_user)
                db.session.commit()

    return jsonify({"message": "Usuarios eliminados exitosamente"}), 200

# Obtener el token de Salesforce (puedes agregar lógica de refrescar token si es necesario)
def get_salesforce_access_token():
    # Lógica para obtener el token desde un archivo de configuración o base de datos
    client_id = 'YOUR_CLIENT_ID'
    client_secret = 'YOUR_CLIENT_SECRET'
    refresh_token = 'YOUR_REFRESH_TOKEN'
    token_url = 'https://thesocialdys-dev-ed.develop.lightning.force.com/services/oauth2/token'
    
    # Si necesitas refrescar el token, usas el refresh_token
    response = requests.post(token_url, data={
        'grant_type': 'refresh_token',
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': refresh_token,
    })
    
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        raise Exception('Error al obtener el token de acceso: ' + response.text)



#import requests
#from credential import USERNAME, PASSWORD

# CONSUMER_KEY='3MVG9JJwBBbcN47Lw.GP2Ap13b7S4gZOlcpJdY2HLPN9.25da0cmnS44eeqpSIsrcKv5OnJUh49836AKgGs51'
# CONSUMER_SECRET= 'E076D338CAF8ECD307E7493E4CDE429C0B8A8123B2ABAB6DA2863866053DD301'
#DOMAIN_NAME=https://thesocialdys-dev-ed.develop.lightning.force.com

#aquire access token
# json_data = {
#     'grant_type': 'password',
#     'client_id': CONSUMER_KEY,
#     'client_secret': CONSUMER_SECRET,
#     'username': USERNAME,
#     'password': PASSWORD,
#     
# }
# response_access_token = requests.post(DOMAIN_NAME + '/services/oauth2/token')
#print(response_access_token.status_code)
#print(response_access_token.reason)
#print(response_access_token.json())
#if response_access_token.status_code == 200:
#   access_token_id= response_access_token.json()['access_token']
#   print('Access token created')
#
#headers = {
#   'Authorization': 'Bearer' + access_token_id
#}
#response_sObject = request.get(DOMAIN_NAME + '/services/data/v53.0/sobjects/sObject', headers=headers)
#print(response_sObject.reason)
#print(response_sObject.json())