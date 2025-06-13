// Add these functions to your existing script.js or create a new auth.js file

// Login functionality
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    const submitBtn = document.getElementById('login-btn');
    
    // Clear previous errors
    errorDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Redirect to chat
            window.location.href = '/';
        } else {
            // Show error
            errorDiv.textContent = data.message;
            errorDiv.style.display = 'block';
        }
        
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
    }
}

// Signup functionality
async function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    const submitBtn = document.getElementById('signup-btn');
    
    // Clear previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            successDiv.textContent = data.message + ' Redirecting to login...';
            successDiv.style.display = 'block';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            errorDiv.textContent = data.message;
            errorDiv.style.display = 'block';
        }
        
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }
}

// Password validation for signup
function validatePassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordHelp = document.getElementById('password-help');
    const confirmHelp = document.getElementById('confirm-help');
    
    // Password strength check
    if (password.length > 0) {
        if (password.length < 6) {
            passwordHelp.textContent = 'Password must be at least 6 characters';
            passwordHelp.style.color = '#ff6b6b';
        } else {
            passwordHelp.textContent = 'Password strength: Good';
            passwordHelp.style.color = '#4a9eff';
        }
        passwordHelp.style.display = 'block';
    } else {
        passwordHelp.style.display = 'none';
    }
    
    // Confirm password check
    if (confirmPassword.length > 0) {
        if (password !== confirmPassword) {
            confirmHelp.textContent = 'Passwords do not match';
            confirmHelp.style.color = '#ff6b6b';
        } else {
            confirmHelp.textContent = 'Passwords match';
            confirmHelp.style.color = '#4a9eff';
        }
        confirmHelp.style.display = 'block';
    } else {
        confirmHelp.style.display = 'none';
    }
}

// Add logout functionality to your existing script.js
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/auth/logout';
    }
}

// Enhanced chat functionality with user sessions
// Add this to your existing sendMessage function in script.js

// Update your existing sendMessage function to include conversation tracking
async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    appendMessage(userMessage, "user");
    inputField.value = "";

    // Store in current conversation
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
            body: JSON.stringify({ 
                message: userMessage,
                conversation_id: currentConversationId 
            }),
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

            setupSpecialButtons(data.mood);

            if (data.mood && data.confidence) {
                console.log(`Detected mood: ${data.mood} (confidence: ${data.confidence.toFixed(2)})`);
            }
        } else {
            appendMessage("⚠️ Sorry, something went wrong.", "bot");
        }
    } catch (error) {
        removeTypingIndicator();
        
        // Handle authentication errors
        if (error.status === 401) {
            alert('Your session has expired. Please login again.');
            window.location.href = '/login';
            return;
        }
        
        appendMessage("⚠️ Network error. Please try again.", "bot");
    }
}

// Load user's conversations on page load
async function loadUserConversations() {
    try {
        const response = await fetch('/api/conversations');
        const data = await response.json();
        
        if (data.conversations) {
            // Update sidebar with user's conversations
            updateConversationsList(data.conversations);
        }
    } catch (error) {
        console.error('Failed to load conversations:', error);
    }
}

function updateConversationsList(userConversations) {
    const conversationList = document.querySelector('.conversation-list');
    const todayGroup = conversationList.querySelector('.conversation-group');
    
    // Clear existing conversations except the template
    const existingItems = todayGroup.querySelectorAll('.conversation-item');
    existingItems.forEach(item => {
        if (item.getAttribute('data-conversation-id') !== '1') {
            item.remove();
        }
    });
    
    // Add user's conversations
    userConversations.forEach(conv => {
        const conversationItem = document.createElement('div');
        conversationItem.className = 'conversation-item';
        conversationItem.setAttribute('data-conversation-id', conv.id);
        conversationItem.onclick = () => selectConversation(conversationItem);
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'conversation-title';
        titleSpan.textContent = conv.title;
        
        conversationItem.appendChild(titleSpan);
        todayGroup.appendChild(conversationItem);
    });
}

// Initialize authentication features when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the chat page and load conversations
    if (window.location.pathname === '/') {
        loadUserConversations();
    }
    
    // Add password validation listeners for signup page
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    
    if (passwordField) {
        passwordField.addEventListener('input', validatePassword);
    }
    
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', validatePassword);
    }
});