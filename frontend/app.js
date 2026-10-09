const codeInput    = document.getElementById("code");
const questionInput = document.getElementById("question");
const askButton    = document.getElementById("askButton");
const responseBox  = document.getElementById("response");

askButton.addEventListener("click", async () => {
  const code     = codeInput.value.trim();
  const question = questionInput.value.trim();

  if (!code || !question) {
    responseBox.textContent = "Please enter both code and a question.";
    return;
  }

  // ── Loading state ──────────────────────────────────────────
  askButton.disabled    = true;
  askButton.textContent = "Thinking...";
  responseBox.textContent = "";
  responseBox.classList.add("is-loading");

  try {
    const response = await fetch("http://localhost:5000/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, question }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    responseBox.textContent = data.response;
  } catch (error) {
    responseBox.textContent = `Error: ${error.message}`;
  } finally {
    // ── Restore state (always runs) ────────────────────────────
    askButton.disabled    = false;
    askButton.textContent = "Ask DevPilot";
    responseBox.classList.remove("is-loading");
  }
});
