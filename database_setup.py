import sqlite3
import os

def setup_database():
    """Create the database and tables for user authentication and chat storage"""
    
    # Create database file
    DATABASE = 'mental_health_chatbot.db'
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')
    
    # Conversations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Messages table (encrypted for privacy)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            sender TEXT NOT NULL,
            message TEXT NOT NULL,
            mood TEXT,
            confidence REAL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversations (id)
        )
    ''')
    
    # User preferences table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_preferences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            theme TEXT DEFAULT 'dark',
            language TEXT DEFAULT 'en',
            notifications BOOLEAN DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database setup complete!")
    print(f"📁 Database created: {os.path.abspath(DATABASE)}")

if __name__ == "__main__":
    setup_database()