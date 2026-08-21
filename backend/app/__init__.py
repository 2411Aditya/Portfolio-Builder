from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.models import db
from app.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Extensions
    db.init_app(app)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Blueprints
    from app.auth.routes import auth_bp
    from app.portfolio.routes import portfolio_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(portfolio_bp, url_prefix='/api')

    # Create tables
    with app.app_context():
        db.create_all()

    return app
