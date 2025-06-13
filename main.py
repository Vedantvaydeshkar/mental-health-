import google.generativeai as genai
import re
from textblob import TextBlob
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string

# Download required NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

API_KEY = "AIzaSyBEubfmiQhpiSaMLm0i119Xi22XEgbH12U"

def init_chatbot():
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=(
            "You are a compassionate, supportive mental health chatbot named 'MindBot'. "
            "Always respond in a calming, non-judgmental, and empathetic tone. "
            "Keep responses conversational and supportive (2-4 sentences usually). "
            "Offer encouragement, emotional support, and acknowledge their feelings. "
            "Avoid giving medical diagnoses or professional therapy advice, but always listen patiently. "
            "Use emojis sparingly and naturally to express empathy, care, or positivity. "
            "Always end responses with warmth and openness for continued conversation."
        )
    )
    chat = model.start_chat(history=[])
    return chat

def detect_mood_nlp(user_input):
    """
    Advanced mood detection using multiple NLP techniques
    Returns: mood category and confidence score
    """
    
    # Clean and preprocess text
    cleaned_text = preprocess_text(user_input)
    
    # 1. Sentiment Analysis using TextBlob
    blob = TextBlob(user_input)
    sentiment_polarity = blob.sentiment.polarity
    sentiment_subjectivity = blob.sentiment.subjectivity
    
    # 2. Keyword-based mood detection
    mood_keywords = {
        'depressed': {
            'keywords': ['depressed', 'sad', 'down', 'hopeless', 'worthless', 'empty', 'numb', 
                        'crying', 'tears', 'miserable', 'devastated', 'heartbroken', 'grief'],
            'weight': 3
        },
        'anxious': {
            'keywords': ['anxious', 'anxiety', 'worried', 'nervous', 'panic', 'scared', 'afraid',
                        'overwhelmed', 'stressed', 'tense', 'restless', 'frightened', 'terrified'],
            'weight': 3
        },
        'lonely': {
            'keywords': ['lonely', 'alone', 'isolated', 'abandoned', 'disconnected', 'empty',
                        'nobody', 'friendless', 'solitary', 'rejected', 'excluded'],
            'weight': 2.5
        },
        'angry': {
            'keywords': ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'irritated',
                        'frustrated', 'pissed', 'livid', 'outraged', 'bitter'],
            'weight': 2
        },
        'confused': {
            'keywords': ['confused', 'lost', 'uncertain', 'unsure', 'doubt', 'unclear',
                        'mixed up', 'puzzled', 'bewildered', 'perplexed'],
            'weight': 1.5
        },
        'tired': {
            'keywords': ['tired', 'exhausted', 'drained', 'weary', 'fatigue', 'worn out',
                        'sleepy', 'burned out', 'depleted', 'spent'],
            'weight': 2
        },
        'positive': {
            'keywords': ['happy', 'good', 'great', 'amazing', 'wonderful', 'excited', 'joy',
                        'grateful', 'blessed', 'content', 'peaceful', 'optimistic'],
            'weight': -1  # Negative weight for positive emotions
        }
    }
    
    # Calculate mood scores
    mood_scores = {}
    words = word_tokenize(cleaned_text.lower())
    
    for mood, data in mood_keywords.items():
        score = 0
        for keyword in data['keywords']:
            if keyword in cleaned_text.lower():
                score += data['weight']
        mood_scores[mood] = score
    
    # 3. Intensity indicators
    intensity_multipliers = {
        'very': 1.5, 'extremely': 2.0, 'really': 1.3, 'so': 1.2, 'completely': 1.8,
        'totally': 1.6, 'absolutely': 1.7, 'deeply': 1.4, 'incredibly': 1.8
    }
    
    intensity_factor = 1.0
    for word, multiplier in intensity_multipliers.items():
        if word in cleaned_text.lower():
            intensity_factor = max(intensity_factor, multiplier)
    
    # Apply intensity factor
    for mood in mood_scores:
        if mood != 'positive':  # Don't amplify positive emotions
            mood_scores[mood] *= intensity_factor
    
    # 4. Combine with sentiment analysis
    if sentiment_polarity < -0.3:  # Negative sentiment
        mood_scores['depressed'] += abs(sentiment_polarity) * 2
        mood_scores['anxious'] += abs(sentiment_polarity) * 1.5
    elif sentiment_polarity > 0.3:  # Positive sentiment
        mood_scores['positive'] += sentiment_polarity * 2
    
    # Find dominant mood
    if max(mood_scores.values()) < 1:
        return 'neutral', 0.5
    
    dominant_mood = max(mood_scores, key=mood_scores.get)
    confidence = min(mood_scores[dominant_mood] / 5.0, 1.0)  # Normalize to 0-1
    
    return dominant_mood, confidence

def preprocess_text(text):
    """Clean and preprocess text for analysis"""
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Remove extra whitespace
    text = ' '.join(text.split())
    return text

def get_mood_based_actions(mood, confidence):
    """
    Return appropriate quick actions based on detected mood
    """
    if confidence < 0.3:  # Low confidence, show general options
        return ["Talk to me", "Get motivational quote", "Try calming exercises"]
    
    mood_actions = {
        'depressed': ["Get motivational quote", "Listen to uplifting music", "Try calming exercises"],
        'anxious': ["Try calming exercises", "Listen to relaxing music", "Get motivational quote"],
        'lonely': ["Talk to me", "Listen to comforting music", "Get motivational quote"],
        'angry': ["Try calming exercises", "Listen to soothing music", "Talk to me"],
        'confused': ["Talk to me", "Try calming exercises", "Get motivational quote"],
        'tired': ["Listen to energizing music", "Try calming exercises", "Get motivational quote"],
        'positive': ["Listen to upbeat music", "Get inspirational quote", "Share your joy"],
        'neutral': ["Talk to me", "Get motivational quote", "Try calming exercises"]
    }
    
    return mood_actions.get(mood, mood_actions['neutral'])

def enhance_with_emojis(text, mood=None):
    """Add contextual emojis based on mood and content"""
    emoji_enhancements = {
        # Emotional states
        r'\b(anxious|anxiety|worried)\b': lambda m: f"{m.group()} 😰",
        r'\b(depressed|sad|down)\b': lambda m: f"{m.group()} 😔",
        r'\b(stressed|overwhelmed)\b': lambda m: f"{m.group()} 😓",
        r'\b(lonely|alone)\b': lambda m: f"{m.group()} 🤗",
        r'\b(panic|panicking)\b': lambda m: f"{m.group()} 🆘",
        
        # Positive responses
        r'\b(breathe|breathing)\b': lambda m: f"{m.group()} 🧘‍♂️",
        r'\b(relax|calm)\b': lambda m: f"{m.group()} 😌",
        r'\b(strong|strength)\b': lambda m: f"{m.group()} 💪",
        r'\b(hope|hopeful)\b': lambda m: f"{m.group()} 🌈",
        r'\b(happy|joy|glad)\b': lambda m: f"{m.group()} 😊",
        r'\b(proud)\b': lambda m: f"{m.group()} 🥹",
        r'\b(peace|peaceful)\b': lambda m: f"{m.group()} ☮️",
        r'\b(support|help)\b': lambda m: f"{m.group()} 🤝",
    }
    
    for pattern, replacement in emoji_enhancements.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    
    # Add mood-specific ending emoji
    mood_emojis = {
        'depressed': ' 💙',
        'anxious': ' 🌸',
        'lonely': ' 🤗',
        'angry': ' 🕊️',
        'confused': ' 💭',
        'tired': ' 🌙',
        'positive': ' ✨'
    }
    
    if mood and mood in mood_emojis and not any(emoji in text for emoji in ['😊', '😔', '😰', '🤗', '💪', '🌈']):
        text += mood_emojis[mood]
    
    return text

def detect_crisis_keywords(user_input):
    """Detect if user might need immediate professional help"""
    crisis_keywords = [
        "suicide", "kill myself", "end it all", "don't want to live",
        "hurt myself", "self harm", "cutting", "overdose", "die"
    ]
    
    user_lower = user_input.lower()
    for keyword in crisis_keywords:
        if keyword in user_lower:
            return True
    return False

def get_response(chat, user_input):
    try:
        # Check for crisis situations first
        if detect_crisis_keywords(user_input):
            crisis_response = (
                "I'm really concerned about you right now. Your feelings are valid, but I want you to know that help is available. "
                "Please consider reaching out to a crisis helpline or mental health professional immediately. "
                "In the US, you can call 988 for the Suicide & Crisis Lifeline. You don't have to go through this alone. 💙"
            )
            return crisis_response, 'crisis', 1.0, []
        
        # Detect mood using NLP
        mood, confidence = detect_mood_nlp(user_input)
        
        # Get AI response
        response = chat.send_message(user_input)
        raw_response = response.text
        
        # Enhance with emojis based on mood
        enhanced_response = enhance_with_emojis(raw_response, mood)
        
        # Get mood-based quick actions
        quick_actions = get_mood_based_actions(mood, confidence)
        
        return enhanced_response, mood, confidence, quick_actions
        
    except Exception as e:
        # Fallback response if AI fails
        fallback_response = (
            "I'm having trouble connecting right now, but I want you to know I'm here for you. "
            "Sometimes talking about how you're feeling can help. Would you like to try again? 💙"
        )
        return fallback_response, 'neutral', 0.5, ["Talk to me", "Try again", "Get support"]

def get_quick_action_response(action_type):
    """Generate responses for quick action buttons"""
    responses = {
        "Talk to me": (
            "I'm here and ready to listen. What's on your mind today? "
            "Remember, there's no judgment here - just support and understanding. 🤗"
        ),
        "Listen to uplifting music": (
            "Music can lift our spirits! Try searching for 'uplifting songs', 'feel-good playlist', "
            "or 'motivational music' on your favorite platform. Let the positive energy flow through you! 🎵✨"
        ),
        "Listen to relaxing music": (
            "Calming music can help soothe your mind. Try 'meditation music', 'nature sounds', "
            "or 'ambient relaxation' tracks. Focus on your breathing as you listen. 🎵😌"
        ),
        "Listen to comforting music": (
            "Sometimes we need music that understands us. Try 'comfort songs', 'healing music', "
            "or artists that speak to your heart. You're not alone in this. 🎵💙"
        ),
        "Listen to soothing music": (
            "Let gentle melodies calm your mind. Search for 'peaceful piano', 'soft instrumental', "
            "or 'calming sounds'. Take deep breaths and let the music wash over you. 🎵🕊️"
        ),
        "Listen to energizing music": (
            "Let's boost your energy! Try 'upbeat songs', 'energizing playlist', "
            "or 'motivational beats'. Sometimes music can help us feel more alive! 🎵⚡"
        ),
        "Listen to upbeat music": (
            "Great choice! Search for 'happy songs', 'upbeat playlist', or 'feel-good hits'. "
            "Let the positive vibes lift your spirits even higher! 🎵😊"
        ),
        "Get motivational quote": (
            "Here's something powerful to remember: 'You are braver than you believe, stronger than you seem, "
            "and more loved than you know.' Every challenge you face is making you stronger. 💪🌟"
        ),
        "Get inspirational quote": (
            "Here's an inspiring thought: 'The best way to predict the future is to create it.' "
            "Your positive energy today is already shaping a brighter tomorrow! ✨🌈"
        ),
        "Try calming exercises": (
            "Let's try a simple breathing exercise: Breathe in slowly for 4 counts, "
            "hold for 4 counts, then breathe out for 6 counts. Repeat 5 times. "
            "Focus only on your breath. You've got this! 🧘‍♂️💙"
        ),
        "Share your joy": (
            "I love that you're feeling positive! What's bringing you joy today? "
            "Sharing good feelings can multiply them and inspire others too. ✨😊"
        ),
        "Try again": (
            "Of course! I'm here whenever you're ready. Take your time, and know that "
            "whatever you're going through, you don't have to face it alone. 💙"
        ),
        "Get support": (
            "Reaching out for support takes courage, and I'm proud of you for that. "
            "I'm here to listen, and if you need professional help, that's okay too. "
            "You deserve all the support and care in the world. 🤝💙"
        )
    }
    
    return responses.get(action_type, responses["Talk to me"])