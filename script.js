document.addEventListener("DOMContentLoaded", function () {
  // HTML Elements 
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotIcon = document.getElementById("chatbot-icon");
  const closeButton = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");

  // Show Chatbot 
  chatbotIcon.addEventListener("click", function () {
    chatbotContainer.classList.remove("hidden"); // Show chat
    chatbotIcon.style.display = "none";          // Hide icon
  });

  // Hide Chatbot 
  closeButton.addEventListener("click", function () {
    chatbotContainer.classList.add("hidden");    // Hide chat
    chatbotIcon.style.display = "flex";          // Show icon again
  });

  //  Send Message 
  sendBtn.addEventListener("click", sendMessage);
  chatbotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (!userMessage) return;

    appendMessage("user", userMessage); // Show user message
    chatbotInput.value = "";            // Clear input
    getBotResponse(userMessage);        // Get bot reply
  }

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
  }

  // Google Gemini API 
  async function getBotResponse(userMessage) {
    const apiKey = ""; // Replace with your real key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      });

      const data = await response.json();

      // Extract bot reply
      const botMessage =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Sorry, I couldn't understand that.";

      appendMessage("bot", botMessage);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      appendMessage("bot", "Oops! Something went wrong. Please try again.");
    }
  }
});
