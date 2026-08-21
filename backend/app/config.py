import os
from dotenv import load_dotenv

load_dotenv()

# Format DATABASE_URL for SQLAlchemy compatibility (Supabase provides postgres:// or postgresql://)
db_url = os.environ.get('DATABASE_URL', 'sqlite:///portfolio.db')
if db_url.startswith('postgres://'):
    db_url = db_url.replace('postgres://', 'postgresql+psycopg://', 1)
elif db_url.startswith('postgresql://'):
    db_url = db_url.replace('postgresql://', 'postgresql+psycopg://', 1)

class Config:
    SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev-secret-key-change-me')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev-secret-key-change-me')
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB upload limit
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp'}
    JWT_ACCESS_TOKEN_EXPIRES = False  # Tokens don't expire (for dev); set timedelta for prod
