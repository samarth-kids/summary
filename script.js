async function summarize() {
  const input = document.getElementById("inputText").value;

  if (!input.trim()) {
    alert("Please enter text to summarize.");
    return;
  }

  document.getElementById("summaryResult").innerText = "Summarizing…";

  try {
const length = document.getElementById("lengthSelect").value;

let minLength = 30, maxLength = 200;
if (length === "short") {
  minLength = 10;
  maxLength = 50;
} else if (length === "long") {
  minLength = 80;
  maxLength = 250;
}
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
  inputs: input,
 parameters: {
  min_length: minLength,
  max_length: maxLength,
  do_sample: false
}
})
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