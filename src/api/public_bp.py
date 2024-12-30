# public_bp.py (Blueprint para las rutas públicas)
# Public está vacio para que lo llenes vos. Podes tener en cuenta las rutas de "admin_bp.py" Podrias hacer casi lo mismo acá.
# Si vas a hacer un copy paste, acordate que tenés que cambiarle los nombres a todas las rutas @admin_bp a @public_bp.
# Después no digas que no te avisé...

from flask import Blueprint, request, jsonify
from models import User
from database import db

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def home():
    return 'Home Page'

@public_bp.route('/about')
def about():
    return 'About Page'

@public_bp.route('/save-preferences', methods=['POST'])
def save_preferences():
    user_id = request.json.get('user_id')
    language = request.json.get('language')
    theme = request.json.get('theme')
    
    user = User.query.get(user_id)
    if user:
        user.language = language
        user.theme = theme
        db.session.commit()
        return jsonify({"message": "Preferences updated!"}), 200
    return jsonify({"error": "User not found"}), 404