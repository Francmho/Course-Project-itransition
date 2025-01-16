from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(255))
    last_login = db.Column(db.DateTime, default=datetime.utcnow)
    is_blocked = db.Column(db.Boolean, default=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    language = db.Column(db.String(10), default='en')  
    theme = db.Column(db.String(10), default='light') 

    # last_name = db.Column(db.String(50))
    # is_active = db.Column(db.Boolean, default=True)

    auth_id = db.Column(db.String(100), unique=True)
    salesforce_access_token = db.Column(db.String(255), nullable=True)
    salesforce_refresh_token = db.Column(db.String(255), nullable=True)
