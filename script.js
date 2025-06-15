async function summarize() {
  const input = document.getElementById("inputText").value;
  const length = document.getElementById("lengthSelect").value;

  if (!input.trim()) {
    alert("Please enter text to summarize.");
    return;
  }

  document.getElementById("summaryResult").innerText = "Summarizing…";

  // Dynamic summary length
  let minLength, maxLength;
  if (length === "short") {
    minLength = 15;
    maxLength = 60;
  } else if (length === "medium") {
    minLength = 30;
    maxLength = 120;
  } else {
    minLength = 50;
    maxLength = 250;
  }

  console.log("Selected Length:", length, "| min:", minLength, "| max:", maxLength);

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", // Replace with your token
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
      document.getElementById("summaryResult").innerText = "Unexpected error.";
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    document.getElementById("summaryResult").innerText = "Error: " + error.message;
  }
}