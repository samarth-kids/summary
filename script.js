const chatBox = document.getElementById("chatBox");
const inputBox = document.getElementById("inputText");
const micBtn = document.getElementById("micBtn");

async function sendMessage() {
  const input = inputBox.value.trim();
  const task = document.getElementById("task").value;
  if (!input) return alert("Please enter some text.");

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = input;
  chatBox.appendChild(userMsg);

  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai";
  aiMsg.innerText = "Om is thinking...";
  chatBox.appendChild(aiMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  let model = "";
  if (task === "summarize") model = "facebook/bart-large-cnn";
  else if (task === "expand") model = "pszemraj/long-t5-tglobal-base-16384-book-summary";
  else if (task === "grammar") model = "vennify/t5-base-grammar-correction";
  else if (task === "qa") model = "deepset/roberta-base-squad2";

  try {
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer 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", // Replace with your actual token
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: task === "qa" ? { question: input, context: input } : input
      })
    });

    const result = await res.json();
    console.log(result);

    if (Array.isArray(result) && result[0]?.summary_text) {
      aiMsg.innerText = result[0].summary_text;
    } else if (result?.answer) {
      aiMsg.innerText = result.answer;
    } else if (result?.error) {
      aiMsg.innerText = "Error: " + result.error;
    } else {
      aiMsg.innerText = "Om couldn't generate a response.";
    }
  } catch (err) {
    aiMsg.innerText = "Network error: " + err.message;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
  inputBox.value = "";
}

function clearChat() {
  chatBox.innerHTML = "";
}

// Voice input using Web Speech API
function startListening() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech recognition not supported in your browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {
    micBtn.classList.add("listening");
    micBtn.innerText = "🛑";
  };

  recognition.onend = () => {
    micBtn.classList.remove("listening");
    micBtn.innerText = "🎤";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputBox.value = transcript;
  };

  recognition.onerror = (event) => {
    console.error("Speech error:", event.error);
  };

  recognition.start();
}