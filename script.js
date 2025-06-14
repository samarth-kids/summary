async function summarize() {
  const input = document.getElementById("inputText").value;

  if (!input.trim()) {
    alert("Please enter text to summarize.");
    return;
  }

  document.getElementById("summaryResult").innerText = "Summarizing…";

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: input })
      }
    );

    const result = await response.json();
    console.log("Response:", result);

    if (result && result[0] && result[0].summary_text) {
      document.getElementById("summaryResult").innerText = result[0].summary_text;
    } else if (result.error) {
      document.getElementById("summaryResult").innerText = "API Error: " + result.error;
    } else {
      document.getElementById("summaryResult").innerText = "No summary found.";
    }
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("summaryResult").innerText = "Something went wrong: " + err.message;
  }
}