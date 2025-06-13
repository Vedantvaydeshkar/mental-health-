// Global variables
let currentConversationId = 1;
let conversations = {
  1: {
    title: "New Chat (1)",
    messages: []
  }
};

// Array of motivational quotes in English and Hindi
const motivationalQuotes = [
  {
    english: "Believe you can and you're halfway there.",
    hindi: "यकीन करो कि आप कर सकते हो, और आप आधे रास्ते पर हैं।",
    emoji: "🌟"
  },
  {
    english: "The only way to do great work is to love what you do.",
    hindi: "महान काम करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्यार करें।",
    emoji: "💪"
  },
  {
    english: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    hindi: "सफलता अंतिम नहीं है, असफलता घातक नहीं है: जारी रखने का साहस ही मायने रखता है।",
    emoji: "🚀"
  },
  {
    english: "Your limitation—it's only your imagination.",
    hindi: "आपकी सीमा—यह केवल आपकी कल्पना है।",
    emoji: "✨"
  },
  {
    english: "Push yourself, because no one else is going to do it for you.",
    hindi: "अपने आप को आगे बढ़ाएं, क्योंकि कोई और आपके लिए यह नहीं करने वाला।",
    emoji: "🔥"
  },
  {
    english: "Great things never come from comfort zones.",
    hindi: "महान चीजें कभी भी आराम के क्षेत्र से नहीं आतीं।",
    emoji: "🌈"
  },
  {
    english: "Dream it. Wish it. Do it.",
    hindi: "इसका सपना देखें। इसकी इच्छा करें। इसे करें।",
    emoji: "⭐"
  },
  {
    english: "The harder you work for something, the greater you'll feel when you achieve it.",
    hindi: "आप किसी चीज़ के लिए जितनी मेहनत करेंगे, उसे हासिल करने पर उतना ही बेहतर महसूस करेंगे।",
    emoji: "🏆"
  },
  {
    english: "Don't stop when you're tired. Stop when you're done.",
    hindi: "थकने पर मत रुकिए। काम पूरा होने पर रुकिए।",
    emoji: "💯"
  },
  {
    english: "Wake up with determination. Go to bed with satisfaction.",
    hindi: "दृढ़ संकल्प के साथ जागें। संतुष्टि के साथ सोएं।",
    emoji: "🌅"
  },
  {
    english: "Every moment is a fresh beginning.",
    hindi: "हर पल एक नई शुरुआत है।",
    emoji: "🌱"
  },
  {
    english: "You are stronger than you think.",
    hindi: "आप उससे कहीं ज्यादा मजबूत हैं जितना आप सोचते हैं।",
    emoji: "💎"
  }
];

// Array of breathing exercises and calming techniques
const breathingExercises = [
  {
    name: "4-7-8 Breathing",
    instruction: "🧘‍♂️ **4-7-8 Breathing Technique:**\n\n1. 🌬️ Breathe in through your nose for 4 counts\n2. ⏸️ Hold your breath for 7 counts\n3. 💨 Exhale through your mouth for 8 counts\n4. 🔄 Repeat 4 times\n\n**Benefits:** This helps calm your nervous system and reduces anxiety! 🌿✨",
    emoji: "🧘‍♂️"
  },
  {
    name: "Box Breathing",
    instruction: "📦 **Box Breathing Exercise:**\n\n1. 🌬️ Breathe in for 4 counts\n2. ⏸️ Hold for 4 counts\n3. 💨 Breathe out for 4 counts\n4. ⏸️ Hold empty for 4 counts\n5. 🔄 Repeat 5-8 times\n\n**Visualization:** Imagine drawing a square with your breath! This technique is used by Navy SEALs for stress management. 📐✨",
    emoji: "📦"
  },
  {
    name: "5-5 Calming Breath",
    instruction: "🌸 **Simple Calming Breath:**\n\n1. 🌬️ Breathe in slowly for 5 counts\n2. 💨 Breathe out slowly for 5 counts\n3. 🧠 Focus only on your breathing\n4. 🔄 Repeat 10 times\n\n**Tip:** Let each breath bring you peace and presence! 🕊️💙",
    emoji: "🌸"
  },
  {
    name: "Progressive Muscle Relaxation",
    instruction: "💆‍♀️ **Progressive Muscle Relaxation:**\n\n1. 🛋️ Sit or lie down comfortably\n2. 👣 Start with your toes - tense for 5 seconds, then relax\n3. ⬆️ Move up to calves, thighs, abdomen, arms, shoulders\n4. 😌 End with your face muscles\n5. 🌊 Feel the wave of relaxation through your body\n\n**Duration:** 10-15 minutes for full body relief! 🌟",
    emoji: "💆‍♀️"
  },
  {
    name: "Mindful 5-4-3-2-1 Grounding",
    instruction: "🧭 **5-4-3-2-1 Grounding Technique:**\n\n**Notice around you:**\n👀 5 things you can SEE\n✋ 4 things you can TOUCH\n👂 3 things you can HEAR\n👃 2 things you can SMELL\n👅 1 thing you can TASTE\n\n**Purpose:** Brings you back to the present moment and reduces anxiety! 🌍💫",
    emoji: "🧭"
  }
];

// Enhanced mood-based music mapping with your provided links
const moodToMusic = {
  anxious: {
    link: "https://open.spotify.com/playlist/08eWe5qrfPRCH4V7P69KRs",
    message: "🎵 I understand you're feeling anxious. Here's a carefully curated playlist to help calm your mind. Take deep breaths and let the music wash over you. 🌊✨"
  },
  anxiety: {
    link: "https://open.spotify.com/track/4TjImtPikYKl2OasCX75j1",
    message: "🎵 Opening a soothing track to help ease your anxiety. Remember, this feeling will pass. You're safe. 🤗💙"
  },
  depressed: {
    link: "https://open.spotify.com/playlist/0KOAKhJYJ08ep5V6juqDUj",
    message: "🎵 I hear that you're going through a tough time. This playlist is designed to gently lift your spirits. You're not alone in this journey. 🌈💚"
  },
  sad: {
    link: "https://open.spotify.com/track/7wBsBJy38NOokQYkWExmsJ",
    message: "🎵 It's okay to feel sad sometimes. Here's a comforting track that acknowledges your feelings while offering gentle hope. 🌙💜"
  },
  stress: {
    link: "https://open.spotify.com/playlist/08eWe5qrfPRCH4V7P69KRs",
    message: "🎵 Stress can feel overwhelming, but music can help. Let these calming sounds help you find your center again. 🧘‍♀️🌿"
  },
  stressed: {
    link: "https://open.spotify.com/playlist/08eWe5qrfPRCH4V7P69KRs",
    message: "🎵 Playing relaxing music to help ease your stress. Take deep breaths and let go of the tension. You've got this! 🌊💪"
  },
  overwhelmed: {
    link: "https://open.spotify.com/playlist/7dwomowISYACpCOZZKonnq",
    message: "🎵 Feeling overwhelmed is exhausting. This peaceful playlist will help create some mental space for you to breathe. 🌸🕊️"
  },
  panic: {
    link: "https://open.spotify.com/track/4TjImtPikYKl2OasCX75j1",
    message: "🎵 If you're experiencing panic, focus on this calming track and your breathing. You are safe. This will pass. 🛡️💙"
  },
  breathe: {
    link: "https://open.spotify.com/track/4TjImtPikYKl2OasCX75j1",
    message: "🎵 Perfect choice - let's focus on breathing together. This track will guide you to a calmer state. 🌬️✨"
  },
  relax: {
    link: "https://open.spotify.com/track/4TjImtPikYKl2OasCX75j1",
    message: "🎵 Time to unwind! This soothing track will help you release tension and find your peaceful center. 🛋️🌙"
  },
  calm: {
    link: "https://open.spotify.com/playlist/7dwomowISYACpCOZZKonnq",
    message: "🎵 Creating a calm atmosphere with this serene playlist. Let tranquility flow through you. 🌊🧘‍♂️"
  },
  strong: {
    link: "https://open.spotify.com/playlist/6o7xiTnPbfA1TpTJlKcrWc",
    message: "🎵 I can sense your inner strength! This empowering playlist will amplify that powerful energy within you. 💪⚡"
  },
  capable: {
    link: "https://open.spotify.com/playlist/7BuI1utMe3usUq115K8mfJ",
    message: "🎵 You ARE capable of amazing things! This uplifting playlist celebrates your potential and abilities. 🌟🚀"
  },
  hope: {
    link: "https://open.spotify.com/playlist/37i9dQZF1DWX3SoTqhs2rq",
    message: "🎵 Hope is a beautiful thing to hold onto. This inspiring playlist will nurture that light within you. 🕯️🌅"
  },
  happy: {
    link: "https://open.spotify.com/playlist/4nNVfQ9eWidZXkBKZN5li4",
    message: "🎵 Wonderful to see you feeling happy! Let's celebrate with this joyful playlist that matches your positive energy! 🎉😊"
  },
  proud: {
    link: "https://open.spotify.com/playlist/4nNVfQ9eWidZXkBKZN5li4",
    message: "🎵 You have every reason to feel proud! This celebratory playlist honors your achievements and growth. 🏆✨"
  },
  focus: {
    link: "https://open.spotify.com/playlist/1Li09bpSDFBuvOxyDObjcy",
    message: "🎵 Great mindset for productivity! This focus-enhancing playlist will help you concentrate and achieve your goals. 🎯🧠"
  },
  peace: {
    link: "https://open.spotify.com/playlist/7dwomowISYACpCOZZKonnq",
    message: "🎵 Embracing peace is a gift to yourself. This tranquil playlist will deepen your sense of inner harmony. ☮️🌸"
  },
  safe: {
    link: "https://open.spotify.com/playlist/08eWe5qrfPRCH4V7P69KRs",
    message: "🎵 You deserve to feel safe and secure. This comforting playlist creates a protective musical sanctuary. 🏠💙"
  },
  support: {
    link: "https://open.spotify.com/track/7wBsBJy38NOokQYkWExmsJ",
    message: "🎵 Remember, you're supported and cared for. This gentle track is like a musical hug when you need it most. 🤗💚"
  },
  courage: {
    link: "https://open.spotify.com/playlist/7BuI1utMe3usUq115K8mfJ",
    message: "🎵 Courage isn't the absence of fear - it's moving forward despite it. This bold playlist will fuel your brave heart. 🦁❤️"
  },
  default: {
    link: "https://open.spotify.com/playlist/37i9dQZF1DX0SM0LYsmbMT",
    message: "🎵 Here's a peaceful playlist to accompany you on your journey. Music can be a wonderful companion for any mood. 🎶💫"
  }
};

// Chat conversation starters
const chatPrompts = [
  "What's on your mind today? I'm here to listen without judgment. 💭",
  "How are you feeling right now? Take your time to find the right words. 💙",
  "Is there anything you'd like to talk about? No topic is too big or small. 🌟",
  "Tell me about something that made you smile recently, even if it was small. 😊",
  "What's been challenging for you lately? Sometimes sharing helps lighten the load. 🤝",
  "What's one thing you're grateful for today? It can be anything at all. 🙏",
  "How has your day been treating you so far? The good and the not-so-good. ☀️",
  "What would make you feel a little better right now? Let's explore together. 💚",
  "Is there something you're worried about that you'd like to share? 🌸",
  "What's something you're looking forward to, even if it's simple? ✨"
];

// Initialize the chat when page loads
document.addEventListener('DOMContentLoaded', function () {
  console.log("Mental Health Chatbot Initialized");
  
  // Add welcome message with delay for better UX - NO BUTTONS YET
  setTimeout(() => {
    appendMessage("Hi there! 😊 I'm so glad you're here. This is a safe space where you can share anything that's on your mind. Whether you want to talk, need some encouragement, or just want to take a moment to breathe - I'm here for you. How are you feeling today? 🌸💙", "bot");
    
    // DON'T show buttons initially - wait for user input and mood detection
    console.log("Welcome message sent. Waiting for user input to detect mood...");
  }, 800);

  // Add enter key listener
  const userInput = document.getElementById("userInput");
  if (userInput) {
    userInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  }
});

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user");
  inputField.value = "";

  conversations[currentConversationId].messages.push({
    text: userMessage,
    sender: "user",
    timestamp: new Date()
  });

  showTypingIndicator();

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    removeTypingIndicator();

    if (data.reply) {
      appendMessage(data.reply, "bot");

      conversations[currentConversationId].messages.push({
        text: data.reply,
        sender: "bot",
        timestamp: new Date(),
        mood: data.mood,
        confidence: data.confidence
      });

      if (data.quick_actions && data.quick_actions.length > 0) {
        showMoodBasedActions(data.quick_actions, data.mood, data.confidence);
      }

      // Only show interactive buttons if mood was detected with sufficient confidence
      if (data.mood && data.confidence && data.confidence > 0.3) {
        console.log(`Mood detected: ${data.mood} (confidence: ${data.confidence.toFixed(2)}) - Showing contextual buttons`);
        setTimeout(() => {
          setupSpecialButtons(data.mood, data.confidence);
        }, 1000);
      } else {
        console.log("No clear mood detected or low confidence - buttons not shown");
      }

      if (data.mood && data.confidence) {
        console.log(`Detected mood: ${data.mood} (confidence: ${data.confidence.toFixed(2)})`);
      }
    } else {
      appendMessage("⚠️ I'm having trouble connecting right now, but I'm still here for you. Please try again in a moment.", "bot");
    }
  } catch (error) {
    removeTypingIndicator();
    console.error("Chat error:", error);
    appendMessage("⚠️ I'm experiencing some technical difficulties, but don't let that stop you from taking care of yourself. Try refreshing the page, and remember - you're doing great by reaching out. 💙", "bot");
  }
}

function showTypingIndicator() {
  const chatBox = document.getElementById("chatbox");
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot typing-indicator";
  typingDiv.innerHTML = `
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  typingDiv.id = "typing-indicator";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) typingIndicator.remove();
}

function showMoodBasedActions(actions, mood, confidence) {
  const chatBox = document.getElementById("chatbox");

  const existingButtons = chatBox.querySelector(".mood-based-actions");
  if (existingButtons) existingButtons.remove();

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "mood-based-actions";

  if (confidence > 0.6 && mood !== 'neutral') {
    const moodIndicator = document.createElement("div");
    moodIndicator.className = "mood-indicator";
    moodIndicator.innerHTML = `<span class="mood-text">💙 I sense you might be feeling ${mood}. Here are some personalized suggestions:</span>`;
    buttonContainer.appendChild(moodIndicator);
  }

  actions.forEach(action => {
    const btn = document.createElement("button");
    btn.className = "chat-option-button";
    btn.innerText = action;

    if (mood === 'anxious' || mood === 'depressed' || mood === 'sad') {
      btn.classList.add('calming-button');
    } else if (mood === 'happy' || mood === 'positive') {
      btn.classList.add('energetic-button');
    }

    btn.onclick = () => {
      document.getElementById("userInput").value = action;
      sendMessage();
      buttonContainer.remove();
    };
    buttonContainer.appendChild(btn);
  });

  chatBox.appendChild(buttonContainer);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🧠 Enhanced Interactive Buttons - ONLY shown after mood detection
function setupSpecialButtons(detectedMood = "neutral", confidence = 0) {
  const chatBox = document.getElementById("chatbox");
  
  // Remove existing special buttons but keep mood-based actions
  const existing = chatBox.querySelector(".special-interactive-buttons");
  if (existing) existing.remove();

  // Only show buttons if we have a detected mood with reasonable confidence
  if (!detectedMood || detectedMood === "neutral" || confidence < 0.3) {
    console.log("Not showing buttons - mood unclear or confidence too low");
    return;
  }

  console.log(`Setting up contextual buttons for mood: ${detectedMood} (confidence: ${confidence.toFixed(2)})`);

  const buttonRow = document.createElement("div");
  buttonRow.className = "special-interactive-buttons";
  
  // Add a contextual message based on detected mood
  const contextMessage = document.createElement("div");
  contextMessage.className = "mood-context-message";
  contextMessage.innerHTML = `<span style="color: #666; font-size: 0.9em;">💙 Based on what you've shared, here are some things that might help:</span>`;
  buttonRow.appendChild(contextMessage);

  const buttons = [
    {
      label: "💫 Motivational Quote",
      action: () => {
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        const quoteMessage = `${randomQuote.emoji} **Daily Inspiration:**\n\n🇬🇧 **English:** "${randomQuote.english}"\n\n🇮🇳 **Hindi:** "${randomQuote.hindi}"\n\nRemember: You have the strength within you to overcome any challenge. Keep believing in yourself! 💪✨🌟`;
        
        appendMessage(quoteMessage, "bot");
        
        // Add a follow-up encouragement
        setTimeout(() => {
          appendMessage("🌈 How does this quote resonate with you? Sometimes the right words at the right time can shift our entire perspective! ✨", "bot");
          setupSpecialButtons(detectedMood);
        }, 2000);
      }
    },
    {
      label: "🧘‍♂️ Calming Exercise",
      action: () => {
        const randomExercise = breathingExercises[Math.floor(Math.random() * breathingExercises.length)];
        
        appendMessage(`🌿 **Let's take a moment for yourself.**\n\n${randomExercise.instruction}\n\n💡 **Remember:** It's perfectly normal if your mind wanders. Just gently bring your attention back to the exercise. You're doing great! 🌸`, "bot");
        
        // Encourage them after the exercise
        setTimeout(() => {
          appendMessage("🌟 Take your time with that exercise. When you're ready, I'm here if you'd like to share how you're feeling or try something else. Your wellbeing matters! 💙", "bot");
          setupSpecialButtons(detectedMood);
        }, 3000);
      }
    },
    {
      label: "💬 Let's Chat",
      action: () => {
        const randomPrompt = chatPrompts[Math.floor(Math.random() * chatPrompts.length)];
        
        appendMessage(`💝 **I'm genuinely glad you want to talk.** \n\n${randomPrompt}\n\nThere's no rush, no pressure, and no judgment here. This is your space to be authentic and real. I'm here to listen with my whole heart. 🤗💙`, "bot");
        
        // Show buttons again after a moment
        setTimeout(() => setupSpecialButtons(detectedMood), 2000);
      }
    },
    {
      label: "🎵 Mood Music",
      action: () => {
        // Try to determine the best music based on detected mood or ask user
        let musicChoice;
        
        // Check if we have a detected mood that matches our music library
        if (detectedMood && moodToMusic[detectedMood.toLowerCase()]) {
          musicChoice = moodToMusic[detectedMood.toLowerCase()];
        } else {
          // Default to a general calming playlist
          musicChoice = moodToMusic.default;
        }
        
        appendMessage(musicChoice.message, "bot");
        
        // Show success message and attempt to open link
        setTimeout(() => {
          try {
            const newWindow = window.open(musicChoice.link, "_blank");
            
            if (newWindow) {
              appendMessage("🎧 **Music is opening in a new tab!** If you don't see it, please check if your browser blocked the popup, or look for a new tab. \n\n🎶 Let the music be your companion. You deserve this moment of peace and care. If Spotify isn't available, try searching for 'calming music' or 'meditation music' on your preferred platform. 🌟💚", "bot");
            } else {
              throw new Error("Popup blocked");
            }
          } catch (error) {
            appendMessage("🎧 **Music Link Ready!** It looks like I can't open the link automatically, but here it is for you:\n\n🔗 " + musicChoice.link + "\n\n💡 **Tip:** You can also search for 'relaxing music', 'meditation music', or 'mood-based playlists' on Spotify, YouTube Music, Apple Music, or any music platform you prefer. Your mental health is worth the extra step! 🌟💙", "bot");
          }
          
          // Show buttons again
          setTimeout(() => setupSpecialButtons(detectedMood), 2000);
        }, 1500);
      }
    }
  ];

  buttons.forEach(({ label, action }) => {
    const btn = document.createElement("button");
    btn.className = "chat-option-button special-button";
    btn.innerHTML = label; // Using innerHTML to support emojis properly
    
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Add visual feedback
      btn.style.transform = "scale(0.95)";
      btn.style.opacity = "0.7";
      
      setTimeout(() => {
        btn.style.transform = "scale(1)";
        btn.style.opacity = "1";
      }, 150);
      
      // Execute the action
      try {
        action();
      } catch (error) {
        console.error("Button action error:", error);
        appendMessage("⚠️ Something went wrong with that action, but I'm still here for you! Please try again. 💙", "bot");
      }
    };
    
    // Add hover effects
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = "scale(1.05)";
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = "scale(1)";
    });
    
    buttonRow.appendChild(btn);
  });

  chatBox.appendChild(buttonRow);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(text, sender, withOptions = false) {
  const chatBox = document.getElementById("chatbox");
  if (!chatBox) {
    console.error("Chatbox element not found");
    return;
  }
  
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  
  // Support for formatted text (bold, etc.)
  if (text.includes('**') || text.includes('\n')) {
    messageDiv.innerHTML = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  } else {
    messageDiv.innerText = text;
  }
  
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Save to conversation history
  if (conversations[currentConversationId]) {
    conversations[currentConversationId].messages.push({
      text: text,
      sender: sender,
      timestamp: new Date()
    });
  }
}

function showQuickActions() {
  const chatBox = document.getElementById("chatbox");
  const options = ["I need someone to talk to", "Help me feel calmer", "I want some encouragement", "Suggest relaxing music"];
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "option-buttons";

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "chat-option-button";
    btn.innerText = option;
    btn.onclick = () => {
      document.getElementById("userInput").value = option;
      sendMessage();
      buttonContainer.remove();
    };
    buttonContainer.appendChild(btn);
  });

  chatBox.appendChild(buttonContainer);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createNewChat() {
  const newId = Math.max(...Object.keys(conversations).map(Number)) + 1;
  currentConversationId = newId;

  conversations[newId] = {
    title: `New Chat (${newId})`,
    messages: []
  };

  addConversationToSidebar(newId, conversations[newId].title);
  document.getElementById("chatbox").innerHTML = "";
  selectConversationById(newId);

  setTimeout(() => {
    appendMessage("Hello! 😊 Welcome to your new conversation. I'm here to support you in whatever way you need today. How are you feeling? 💙", "bot");
    // Don't show buttons until user shares something and mood is detected
  }, 500);
}

function addConversationToSidebar(id, title) {
  const conversationList = document.querySelector(".conversation-list");
  if (!conversationList) return;
  
  const todayGroup = conversationList.querySelector(".conversation-group");
  if (!todayGroup) return;

  const conversationItem = document.createElement("div");
  conversationItem.className = "conversation-item";
  conversationItem.setAttribute("data-conversation-id", id);
  conversationItem.onclick = () => selectConversation(conversationItem);

  const titleSpan = document.createElement("span");
  titleSpan.className = "conversation-title";
  titleSpan.textContent = title;

  conversationItem.appendChild(titleSpan);
  todayGroup.appendChild(conversationItem);
}

function selectConversation(element) {
  document.querySelectorAll(".conversation-item").forEach(item => item.classList.remove("active"));
  element.classList.add("active");
  const conversationId = parseInt(element.getAttribute("data-conversation-id")) || 1;
  switchToConversation(conversationId);
}

function selectConversationById(id) {
  const element = document.querySelector(`[data-conversation-id="${id}"]`);
  if (element) selectConversation(element);
}

function switchToConversation(conversationId) {
  currentConversationId = conversationId;
  const chatBox = document.getElementById("chatbox");
  if (!chatBox) return;
  
  chatBox.innerHTML = "";

  if (conversations[conversationId] && conversations[conversationId].messages.length > 0) {
    conversations[conversationId].messages.forEach(msg => {
      appendMessage(msg.text, msg.sender);
    });
    
    // Only show buttons if the last message had mood detection
    const lastBotMessage = conversations[conversationId].messages
      .filter(msg => msg.sender === "bot" && msg.mood)
      .pop();
    
    if (lastBotMessage && lastBotMessage.mood && lastBotMessage.confidence > 0.3) {
      setTimeout(() => setupSpecialButtons(lastBotMessage.mood, lastBotMessage.confidence), 800);
    }
  } else {
    // Don't show buttons for empty conversations - wait for user input
    console.log("Empty conversation loaded - waiting for user input");
  }
}

// Initialize default conversation
document.addEventListener('DOMContentLoaded', function () {
  const defaultConversation = document.querySelector(".conversation-item");
  if (defaultConversation) {
    defaultConversation.setAttribute("data-conversation-id", "1");
  }
  
  console.log("Mental Health Chatbot fully loaded and ready!");
});