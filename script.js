const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
const API_TOKEN = "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"; // Replace with yours if needed

const chatBox = document.getElementById("chatBox");
const inputText = document.getElementById("inputText");
const summaryLength = document.getElementById("summaryLength");
const statusEl = document.getElementById("status");

// Check model readiness
async function checkModelStatus() {
  statusEl.innerHTML = `<span class="dot orange"></span> Checking model...`;

  try {
    const res = await fetch("https://huggingface.co/api/models/facebook/bart-large-cnn");
    const data = await res.json();

    if (data?.lastModified) {
      statusEl.innerHTML = `<span class="dot green"></span> Om is ready`;
    } else {
      statusEl.innerHTML = `<span class="dot red"></span> Model not ready`;
    }
  } catch (err) {
    statusEl.innerHTML = `<span class="dot red"></span> Failed to check model status`;
  }
}

// Handle summarization
async function summarize() {
  const input = inputText.value.trim();
  if (!input) return alert("Please enter some text.");

  // Append user message
  addMessage(input, "user");

  // AI typing animation
  const aiMsg = addMessage("Om is thinking...", "ai", true);

  // Length setting
  let minLen = 30, maxLen = 120;
  if (summaryLength.value === "short") { minLen = 10; maxLen = 60; }
  else if (summaryLength.value === "long") { minLen = 60; maxLen = 300; }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: input,
        parameters: {
          min_length: minLen,
          max_length: maxLen,
          do_sample: false
        }
      })
    });

    const result = await response.json();
    aiMsg.classList.remove("typing");
    aiMsg.innerText = result?.[0]?.summary_text || result?.error || "No summary available.";
  } catch (error) {
    aiMsg.classList.remove("typing");
    aiMsg.innerText = "Error: " + error.message;
  }

  inputText.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Add chat message
function addMessage(text, sender = "user", isTyping = false) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  if (isTyping) msg.classList.add("typing");
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// Clear chat
function clearChat() {
  chatBox.innerHTML = "";
}

// Voice input
function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech recognition not supported.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputText.value = transcript;
  };

  recognition.onerror = (event) => {
    alert("Speech recognition error: " + event.error);
  };

  recognition.start();
}

// Initialize
checkModelStatus();