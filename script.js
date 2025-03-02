document.addEventListener('DOMContentLoaded', function() {
    // Auth elements
    const authContainer = document.getElementById('auth-container');
    const chatContainer = document.getElementById('chat-container');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginMessage = document.getElementById('login-message');
    const signupMessage = document.getElementById('signup-message');
    const logoutBtn = document.getElementById('logout-btn');
    const userWelcome = document.getElementById('user-welcome');
    
    // Chat elements
    const chatMessagesWeightloss = document.getElementById('chat-messages-weightloss');
    const chatMessagesMusclegain = document.getElementById('chat-messages-musclegain');
    const typingIndicator = document.getElementById('typing-indicator');
    const goalBtns = document.querySelectorAll('.goal-btn');
    const suggestionChipsContainer = document.getElementById('suggestion-chips');
  
    // User data storage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    
    // Default goal
    let currentGoal = 'weight-loss';
  
    // Check if user is logged in
    if (currentUser) {
      showChat();
      userWelcome.textContent = `Welcome, ${currentUser.name}!`;
    }
  
    // Auth tabs switching
    authTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active form
        authForms.forEach(form => {
          form.classList.remove('active');
          if (form.id === `${tabId}-form`) {
            form.classList.add('active');
          }
        });
        
        // Clear messages
        loginMessage.textContent = '';
        loginMessage.style.display = 'none';
        signupMessage.textContent = '';
        signupMessage.style.display = 'none';
      });
    });
  
    // Sign up form submission
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;
      
      // Validation
      if (password !== confirm) {
        showMessage(signupMessage, 'Passwords do not match', 'error');
        return;
      }
      
      // Check if email already exists
      if (users.some(user => user.email === email)) {
        showMessage(signupMessage, 'Email already registered', 'error');
        return;
      }
      
      // Add new user
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      showMessage(signupMessage, 'Account created successfully! You can now login.', 'success');
      signupForm.reset();
      
      // Switch to login tab after 2 seconds
      setTimeout(() => {
        authTabs[0].click();
      }, 2000);
    });
  
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      
      // Find user
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Set current user (excluding password for security)
        currentUser = {
          name: user.name,
          email: user.email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showMessage(loginMessage, 'Login successful! Redirecting...', 'success');
        
        // Show chat interface after 1 second
        setTimeout(() => {
          showChat();
          userWelcome.textContent = `Welcome, ${currentUser.name}!`;
        }, 1000);
      } else {
        showMessage(loginMessage, 'Invalid email or password', 'error');
      }
    });
  
    // Logout button
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      currentUser = null;
      showAuth();
      loginForm.reset();
    });
  
    // Show auth or chat container
    function showAuth() {
      authContainer.style.display = 'block';
      chatContainer.style.display = 'none';
    }
    
    function showChat() {
      authContainer.style.display = 'none';
      chatContainer.style.display = 'flex';
    }
  
    // Show message in forms
    function showMessage(element, message, type) {
      element.textContent = message;
      element.className = 'auth-message';
      element.classList.add(type);
      element.style.display = 'block';
    }
  
    // Suggestion chips for each goal
    const suggestionChipsWeightLoss = [
      "What foods help burn fat?",
      "Best pre-workout meal?",
      "Protein sources for vegans",
      "Low carb dinner ideas",
      "High protein breakfast ideas",
      "Healthy snacks for weight loss",
      "Foods to boost metabolism",
      "Meal prepping tips"
    ];
  
    const suggestionChipsMuscleGain = [
      "What foods help build muscle?",
      "Best post-workout meal?",
      "Protein sources for muscle gain",
      "Carb-loading dinner ideas",
      "High protein breakfast ideas",
      "Healthy snacks for muscle gain",
      "Foods to boost metabolism",
      "Meal prepping tips"
    ];
  
    // Responses for each suggestion
    const responsesWeightLoss = {
      "What foods help burn fat?": "For burning fat, focus on lean proteins (chicken breast, turkey, fish), green leafy vegetables (spinach, kale), berries (blueberries, strawberries), and whole grains (oats, quinoa). These foods are nutrient-dense but relatively low in calories, helping create a caloric deficit while keeping you full longer.",
      "Best pre-workout meal?": "For weight loss, try a light pre-workout meal about 1-2 hours before exercising. Good options include oatmeal with a banana, apple slices with a tablespoon of almond butter, or a small protein smoothie with berries. These provide sustainable energy without excess calories that might counteract your weight loss efforts.",
      "Protein sources for vegans": "Great vegan protein sources include lentils (18g per cup), chickpeas (15g per cup), tofu (20g per cup), tempeh (31g per cup), edamame (17g per cup), quinoa (8g per cup), and various beans. Plant-based protein powders like pea, hemp, or brown rice protein are also excellent options to supplement your diet.",
      "Low carb dinner ideas": "Some delicious low-carb dinners include: grilled chicken or fish with roasted vegetables, zucchini noodles with turkey meatballs, cauliflower rice stir-fry with tofu or shrimp, taco lettuce wraps, stuffed bell peppers with ground turkey and vegetables, or a hearty salad with grilled protein and avocado.",
      "High protein breakfast ideas": "Try Greek yogurt with berries and a sprinkle of nuts (25g protein), scrambled eggs with spinach and feta cheese (20g protein), a protein smoothie with protein powder, banana and almond milk (30g protein), or cottage cheese with fruit (28g protein per cup). These options keep you full and support muscle maintenance during weight loss.",
      "Healthy snacks for weight loss": "Smart snacking options include apple slices with 1 tbsp almond butter, Greek yogurt with berries, carrot sticks with 2 tbsp hummus, a small handful of mixed nuts (about 1oz), a hard-boiled egg, celery with a little peanut butter, or a protein shake. Keep portions controlled and aim for snacks under 200 calories.",
      "Foods to boost metabolism": "Metabolism-boosting foods include lean proteins (requires more energy to digest), spicy foods containing capsaicin (like chili peppers), green tea (contains catechins), coffee (caffeine temporarily increases metabolic rate), apple cider vinegar, and high-fiber fruits and vegetables. Cold water and foods rich in iron, zinc, and selenium also support metabolic function.",
      "Meal prepping tips": "For weight loss meal prep: 1) Use portion-controlled containers to avoid overeating, 2) Prep lean proteins in bulk (grilled chicken, hard-boiled eggs), 3) Steam or roast large batches of vegetables, 4) Prepare complex carbs like quinoa or sweet potatoes, 5) Make homemade dressings with less oil, 6) Cut up fruit for easy snacking, and 7) Keep healthy emergency snacks available."
    };
  
    const responsesMuscleGain = {
      "What foods help build muscle?": "Focus on high-quality proteins like chicken breast (31g protein/100g), lean beef (26g/100g), eggs (6g each), Greek yogurt (10g/100g), cottage cheese (11g/100g), and whey protein. Pair with complex carbs like sweet potatoes, brown rice, and oats for energy. Include healthy fats from avocados, nuts, and olive oil. Aim for a slight caloric surplus (200-300 calories) above maintenance.",
      "Best post-workout meal?": "Your post-workout meal should contain both protein and carbs in a 1:2 or 1:3 ratio, consumed within 45 minutes after training. Good options include a protein shake with a banana, chicken with sweet potatoes, Greek yogurt with fruit and honey, or eggs with whole grain toast. This combination helps repair muscle tissue and replenish glycogen stores.",
      "Protein sources for muscle gain": "Top protein sources for muscle building include lean meats (chicken breast: 31g/100g, turkey: 29g/100g, lean beef: 26g/100g), fish (tuna: 30g/100g, salmon: 25g/100g), dairy (Greek yogurt: 10g/100g, cottage cheese: 11g/100g), eggs (6g each), whey protein (80-90% protein), and for plant-based options: tofu, tempeh, seitan, legumes, and protein powders.",
      "Carb-loading dinner ideas": "Nutrient-rich carb-loading dinners for muscle gain include: salmon with brown rice and broccoli, chicken pasta with whole grain noodles, steak with sweet potato and asparagus, turkey with quinoa and mixed vegetables, or lentil pasta with lean ground beef. Aim for 1-2 cups of complex carbs paired with a palm-sized portion of protein.",
      "High protein breakfast ideas": "Muscle-building breakfast options include: 3-egg omelet with vegetables and cheese (25g protein), Greek yogurt parfait with fruit, nuts and granola (30g protein), protein pancakes made with protein powder and topped with nut butter (35g protein), or a breakfast burrito with eggs, black beans, cheese and vegetables in a whole-grain wrap (30g protein).",
      "Healthy snacks for muscle gain": "Protein-rich snacks include Greek yogurt with honey (17g protein/cup), cottage cheese with pineapple (25g protein/cup), protein shake with milk (30g+ protein), tuna on whole-grain crackers (25g protein), jerky (14g protein/oz), a handful of mixed nuts (6g protein/oz), hard-boiled eggs (6g protein each), or apple slices with peanut butter (8g protein/2 tbsp).",
      "Foods to boost metabolism": "Include metabolism-boosting foods like lean proteins (requires more energy to digest), chili peppers (capsaicin increases calorie burning), green tea and coffee (caffeine temporarily raises metabolic rate), MCT oil, and high-iron foods (meat, spinach, lentils). Strength training also boosts metabolism by increasing muscle mass, which burns more calories even at rest.",
      "Meal prepping tips": "For muscle-building meal prep: 1) Prepare large batches of protein sources like chicken, lean beef, and hard-boiled eggs, 2) Cook complex carbs in bulk (rice, potatoes, pasta), 3) Steam/roast vegetables for micronutrients, 4) Make protein-rich snacks, 5) Use the right containers with separate compartments, 6) Label with dates, and 7) Consider your training schedule when planning portions."
    };
  
    // Initialize suggestion chips for default goal
    updateSuggestionChips();
  
    // Switch between Weight Loss and Muscle Gain
    goalBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        goalBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentGoal = this.getAttribute('data-goal');
        
        // Toggle which chat area is visible
        if (currentGoal === 'weight-loss') {
          chatMessagesWeightloss.style.display = "block";
          chatMessagesMusclegain.style.display = "none";
        } else {
          chatMessagesWeightloss.style.display = "none";
          chatMessagesMusclegain.style.display = "block";
        }
        
        updateSuggestionChips();
      });
    });
  
    // Create the suggestion chips based on current goal
    function updateSuggestionChips() {
      suggestionChipsContainer.innerHTML = "";
      const chips = currentGoal === 'weight-loss'
        ? suggestionChipsWeightLoss
        : suggestionChipsMuscleGain;
  
      chips.forEach(chipText => {
        const chip = document.createElement('div');
        chip.className = 'suggestion-chip';
        chip.textContent = chipText;
        chip.addEventListener('click', function() {
          addUserMessage(chipText);
          showTypingIndicator();
          setTimeout(() => {
            hideTypingIndicator();
            const responseText = (currentGoal === 'weight-loss')
              ? responsesWeightLoss[chipText]
              : responsesMuscleGain[chipText];
            addBotMessage(responseText || "Sorry, no response available.");
          }, 1000);
        });
        suggestionChipsContainer.appendChild(chip);
      });
    }
  
    // Get the active chat container
    function getCurrentChat() {
      return currentGoal === 'weight-loss'
        ? chatMessagesWeightloss
        : chatMessagesMusclegain;
    }
  
    // Add user message to active chat
    function addUserMessage(message) {
      const chat = getCurrentChat();
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message user';
      messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-avatar">
          <img src="diet_bot.avif" alt="User">
        </div>
      `;
      chat.appendChild(messageDiv);
      scrollToBottom(chat);
    }
  
    // Add bot message to active chat
    function addBotMessage(message) {
      const chat = getCurrentChat();
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message bot';
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <img src="diet_bot.avif" alt="Bot">
        </div>
        <div class="message-content">${message}</div>
      `;
      chat.appendChild(messageDiv);
      scrollToBottom(chat);
    }
  
    // Show typing indicator
    function showTypingIndicator() {
      typingIndicator.classList.add('active');
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
      typingIndicator.classList.remove('active');
    }
    
    // Scroll active chat container to bottom
    function scrollToBottom(chat) {
      chat.scrollTop = chat.scrollHeight;
    }
  });
  