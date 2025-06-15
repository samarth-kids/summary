async function summarize() {
  const input = document.getElementById("inputText").value;
  const lengthOption = document.getElementById("summaryLength").value;
  const chatBox = document.getElementById("chatBox");

  if (!input.trim()) {
    alert("Please enter text to summarize.");
    return;
  }

  // Add user message to chat
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.innerText = input;
  chatBox.appendChild(userMsg);

  // Add "typing" effect
  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai";
  aiMsg.innerText = "Summarizing";
aiMsg.classList.add("typing-dots");
  chatBox.appendChild(aiMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Define summary parameters
  let minLen = 30, maxLen = 120;
  if (lengthOption === "short") {
    minLen = 10;
    maxLen = 60;
  } else if (lengthOption === "long") {
    minLen = 60;
    maxLen = 300;
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",  // Replace with your token
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
    console.log("Response:", result);

    if (result && result[0] && result[0].summary_text) {
      aiMsg.innerText = result[0].summary_text;
    } else if (result.error) {
      aiMsg.innerText = "API Error: " + result.error;
    } else {
      aiMsg.innerText = "Unexpected response from AI.";
    }
  } catch (error) {
    aiMsg.innerText = "Request failed: " + error.message;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
  document.getElementById("inputText").value = "";
}