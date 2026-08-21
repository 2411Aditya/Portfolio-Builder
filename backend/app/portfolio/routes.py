import json
import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from slugify import slugify
from app.models import db, User, Portfolio
from app.utils.ai_parser import parse_resume

portfolio_bp = Blueprint('portfolio', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# --------------------------------------------------------------------------- #
#  POST /api/portfolio/generate
# --------------------------------------------------------------------------- #

@portfolio_bp.route('/portfolio/generate', methods=['POST'])
@jwt_required()
def generate_portfolio():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file uploaded'}), 400

    file = request.files['resume']
    theme = request.form.get('theme', 'dark')

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': f'File type not allowed. Supported: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

    if theme not in ('dark', 'light'):
        theme = 'dark'

    # Read file bytes
    file_bytes = file.read()

    # Parse with AI
    try:
        parsed_data = parse_resume(file_bytes, file.filename)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'AI parsing failed: {str(e)}'}), 500

    # Generate portfolio record
    portfolio_id = str(uuid.uuid4())
    name = parsed_data.get('name', 'Portfolio')
    title = parsed_data.get('title', 'Professional')
    portfolio_title = f"{name} — {title}" if name and title else (name or title or 'My Portfolio')
    slug = slugify(name or 'portfolio')

    portfolio = Portfolio(
        id=portfolio_id,
        user_id=user_id,
        title=portfolio_title,
        slug=slug,
        theme=theme,
        data=json.dumps(parsed_data)
    )
    db.session.add(portfolio)
    db.session.commit()

    public_url = f"/p/{user.username}/{portfolio_id}"
    return jsonify({
        'message': 'Portfolio generated successfully',
        'portfolio': portfolio.to_dict(),
        'public_url': public_url
    }), 201


# --------------------------------------------------------------------------- #
#  GET /api/portfolio/history
# --------------------------------------------------------------------------- #

@portfolio_bp.route('/portfolio/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    portfolios = Portfolio.query.filter_by(user_id=user_id).order_by(Portfolio.created_at.desc()).all()
    result = []
    for p in portfolios:
        d = p.to_dict()
        d['public_url'] = f"/p/{user.username}/{p.id}"
        result.append(d)

    return jsonify({'portfolios': result}), 200


# --------------------------------------------------------------------------- #
#  DELETE /api/portfolio/<id>
# --------------------------------------------------------------------------- #

@portfolio_bp.route('/portfolio/<string:portfolio_id>', methods=['DELETE'])
@jwt_required()
def delete_portfolio(portfolio_id):
    user_id = int(get_jwt_identity())
    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=user_id).first()

    if not portfolio:
        return jsonify({'error': 'Portfolio not found or access denied'}), 404

    db.session.delete(portfolio)
    db.session.commit()
    return jsonify({'message': 'Portfolio deleted successfully'}), 200


# --------------------------------------------------------------------------- #
#  GET /api/public/portfolio/<username>/<portfolioId>
# --------------------------------------------------------------------------- #

@portfolio_bp.route('/public/portfolio/<string:username>/<string:portfolio_id>', methods=['GET'])
def get_public_portfolio(username, portfolio_id):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=user.id).first()
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404

    d = portfolio.to_dict()
    d['owner_username'] = user.username
    return jsonify({'portfolio': d}), 200
