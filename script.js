async function summarize() {
  const input = document.getElementById("inputText").value.trim();
  const lengthOption = document.getElementById("summaryLength").value;
  const chatBox = document.getElementById("chatBox");

  if (!input) {
    alert("Please enter text to summarize.");
    return;
  }

  // Add user message to chat
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = input;
  chatBox.appendChild(userMsg);

  // Typing animation
  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai typing-dots";
  aiMsg.innerText = "Summarizing";
  chatBox.appendChild(aiMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  let minLen = 30, maxLen = 120;
  if (lengthOption === "short") {
    minLen = 10; maxLen = 60;
  } else if (lengthOption === "long") {
    minLen = 60; maxLen = 300;
  }

  try {
    console.log("Sending request to Hugging Face...");

    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
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
    console.log("API Raw Result:", result);

    if (result && result[0] && result[0].summary_text) {
      aiMsg.classList.remove("typing-dots");
      aiMsg.innerText = result[0].summary_text;
    } else if (result.error && result.error.includes("loading")) {
      aiMsg.innerText = "Model is loading. Try again in 20–30 seconds.";
    } else if (result.error) {
      aiMsg.innerText = "API Error: " + result.error;
    } else {
      aiMsg.innerText = "Unexpected response.";
    }

  } catch (error) {
    aiMsg.innerText = "Fetch failed: " + error.message;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
  document.getElementById("inputText").value = "";
}