from flask import Flask, request, jsonify, render_template, redirect, url_for, session, flash
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
from datetime import datetime
import json
from functools import wraps
from main import init_chatbot, get_response, get_quick_action_response
import logging

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production-2024'  # Change this!
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE = 'mental_health_chatbot.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def login_required(f):
    """Decorator to require login for certain routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Initialize chatbot
try:
    chatbot = init_chatbot()
    logger.info("Chatbot initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize chatbot: {e}")
    chatbot = None

# ==================== AUTHENTICATION ROUTES ====================

@app.route("/")
def index():
    """Main page - redirect to login if not authenticated, otherwise show chat"""
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template("index.html")  # Your existing chat template

@app.route("/login")
def login():
    """Show login page"""
    if 'user_id' in session:
        return redirect(url_for('index'))
    return render_template("login.html")

@app.route("/signup")
def signup():
    """Show signup page"""
    if 'user_id' in session:
        return redirect(url_for('index'))
    return render_template("signup.html")

@app.route("/auth/signup", methods=["POST"])
def auth_signup():
    """Handle signup form submission"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')
        
        # Validation
        if not username or not email or not password:
            return jsonify({"success": False, "message": "All fields are required"}), 400
            
        if len(username) < 3:
            return jsonify({"success": False, "message": "Username must be at least 3 characters"}), 400
            
        if len(password) < 6:
            return jsonify({"success": False, "message": "Password must be at least 6 characters"}), 400
            
        if password != confirm_password:
            return jsonify({"success": False, "message": "Passwords do not match"}), 400
            
        # Check if user already exists
        conn = get_db_connection()
        existing_user = conn.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            (username, email)
        ).fetchone()
        
        if existing_user:
            conn.close()
            return jsonify({"success": False, "message": "Username or email already exists"}), 409
        
        # Create new user
        password_hash = generate_password_hash(password)
        cursor = conn.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            (username, email, password_hash)
        )
        user_id = cursor.lastrowid
        
        # Create default preferences
        conn.execute(
            'INSERT INTO user_preferences (user_id) VALUES (?)',
            (user_id,)
        )
        
        # Create first conversation
        conn.execute(
            'INSERT INTO conversations (user_id, title) VALUES (?, ?)',
            (user_id, 'Welcome Chat')
        )
        
        conn.commit()
        conn.close()
        
        logger.info(f"New user registered: {username}")
        return jsonify({"success": True, "message": "Account created successfully!"})
        
    except Exception as e:
        logger.error(f"Signup error: {e}")
        return jsonify({"success": False, "message": "Server error occurred"}), 500

@app.route("/auth/login", methods=["POST"])
def auth_login():
    """Handle login form submission"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({"success": False, "message": "Username and password are required"}), 400
        
        # Check user credentials
        conn = get_db_connection()
        user = conn.execute(
            'SELECT id, username, password_hash FROM users WHERE username = ? OR email = ?',
            (username, username)
        ).fetchone()
        
        if user and check_password_hash(user['password_hash'], password):
            # Update last login
            conn.execute(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                (user['id'],)
            )
            conn.commit()
            conn.close()
            
            # Set session
            session['user_id'] = user['id']
            session['username'] = user['username']
            
            logger.info(f"User logged in: {user['username']}")
            return jsonify({"success": True, "message": "Login successful!"})
        else:
            conn.close()
            return jsonify({"success": False, "message": "Invalid username or password"}), 401
            
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"success": False, "message": "Server error occurred"}), 500

@app.route("/auth/logout")
def logout():
    """Handle logout"""
    username = session.get('username', 'Unknown')
    session.clear()
    logger.info(f"User logged out: {username}")
    flash("You have been logged out successfully", "info")
    return redirect(url_for('login'))

# ==================== CHAT ROUTES (Protected) ====================

@app.route("/chat", methods=["POST"])
@login_required
def chat():
    """Handle chat messages - now with user-specific storage"""
    if not chatbot:
        return jsonify({"error": "Chatbot is not available. Please try again later."}), 503
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided."}), 400
            
        user_message = data.get("message", "").strip()
        conversation_id = data.get("conversation_id", 1)  # Default conversation
        
        if not user_message:
            return jsonify({"error": "Please provide a message."}), 400

        user_id = session['user_id']
        logger.info(f"User {user_id}: received message: {user_message[:50]}...")
        
        # Check if it's a quick action
        all_quick_actions = [
            "Talk to me", "Listen to uplifting music", "Listen to relaxing music",
            "Listen to comforting music", "Listen to soothing music", "Listen to energizing music",
            "Listen to upbeat music", "Get motivational quote", "Get inspirational quote",
            "Try calming exercises", "Share your joy", "Try again", "Get support"
        ]
        
        if user_message in all_quick_actions:
            reply = get_quick_action_response(user_message)
            mood = "neutral"
            confidence = 0.8
            quick_actions = ["Talk to me", "Get motivational quote", "Try calming exercises"]
        else:
            # Get response with mood detection
            reply, mood, confidence, quick_actions = get_response(chatbot, user_message)
        
        # Save user message to database
        conn = get_db_connection()
        
        # Ensure conversation exists
        conv = conn.execute(
            'SELECT id FROM conversations WHERE id = ? AND user_id = ?',
            (conversation_id, user_id)
        ).fetchone()
        
        if not conv:
            # Create new conversation
            cursor = conn.execute(
                'INSERT INTO conversations (user_id, title) VALUES (?, ?)',
                (user_id, f"Chat {datetime.now().strftime('%b %d')}")
            )
            conversation_id = cursor.lastrowid
        
        # Save user message
        conn.execute(
            'INSERT INTO messages (conversation_id, sender, message) VALUES (?, ?, ?)',
            (conversation_id, 'user', user_message)
        )
        
        # Save bot response
        conn.execute(
            'INSERT INTO messages (conversation_id, sender, message, mood, confidence) VALUES (?, ?, ?, ?, ?)',
            (conversation_id, 'bot', reply, mood, confidence)
        )
        
        # Update conversation timestamp
        conn.execute(
            'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            (conversation_id,)
        )
        
        conn.commit()
        conn.close()
        
        logger.info(f"Response generated successfully. Detected mood: {mood} (confidence: {confidence:.2f})")
        
        return jsonify({
            "reply": reply,
            "mood": mood,
            "confidence": confidence,
            "quick_actions": quick_actions,
            "conversation_id": conversation_id
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({
            "reply": "I'm having some technical difficulties right now, but I'm still here for you. "
                    "Please try sending your message again. 💙",
            "mood": "neutral",
            "confidence": 0.5,
            "quick_actions": ["Talk to me", "Try again", "Get support"]
        }), 200

@app.route("/api/conversations", methods=["GET"])
@login_required
def get_conversations():
    """Get user's conversations"""
    try:
        user_id = session['user_id']
        conn = get_db_connection()
        
        conversations = conn.execute('''
            SELECT c.id, c.title, c.created_at, c.updated_at,
                   COUNT(m.id) as message_count
            FROM conversations c
            LEFT JOIN messages m ON c.id = m.conversation_id
            WHERE c.user_id = ?
            GROUP BY c.id
            ORDER BY c.updated_at DESC
        ''', (user_id,)).fetchall()
        
        conn.close()
        
        return jsonify({
            "conversations": [dict(conv) for conv in conversations]
        })
        
    except Exception as e:
        logger.error(f"Error fetching conversations: {e}")
        return jsonify({"error": "Failed to fetch conversations"}), 500

@app.route("/api/conversations/<int:conversation_id>/messages", methods=["GET"])
@login_required
def get_conversation_messages(conversation_id):
    """Get messages for a specific conversation"""
    try:
        user_id = session['user_id']
        conn = get_db_connection()
        
        # Verify conversation belongs to user
        conv = conn.execute(
            'SELECT id FROM conversations WHERE id = ? AND user_id = ?',
            (conversation_id, user_id)
        ).fetchone()
        
        if not conv:
            conn.close()
            return jsonify({"error": "Conversation not found"}), 404
        
        messages = conn.execute('''
            SELECT sender, message, mood, confidence, timestamp
            FROM messages
            WHERE conversation_id = ?
            ORDER BY timestamp ASC
        ''', (conversation_id,)).fetchall()
        
        conn.close()
        
        return jsonify({
            "messages": [dict(msg) for msg in messages]
        })
        
    except Exception as e:
        logger.error(f"Error fetching messages: {e}")
        return jsonify({"error": "Failed to fetch messages"}), 500

# ==================== UTILITY ROUTES ====================

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "chatbot_ready": chatbot is not None,
        "database_connected": os.path.exists(DATABASE)
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    # Ensure database exists
    if not os.path.exists(DATABASE):
        from database_setup import setup_database
        setup_database()
    
    app.run(debug=True, host="0.0.0.0", port=5000)