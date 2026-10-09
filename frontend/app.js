const codeInput     = document.getElementById("code");
const questionInput  = document.getElementById("question");
const askButton     = document.getElementById("askButton");
const responseBox   = document.getElementById("response");
const codeError     = document.getElementById("code-error");
const questionError  = document.getElementById("question-error");
const errorState    = document.getElementById("error-state");
const errorMsg      = document.getElementById("error-msg");
const retryButton   = document.getElementById("retryButton");

// ── Helpers ──────────────────────────────────────────────────
function showResponseBox() {
  responseBox.hidden = false;
  errorState.hidden  = true;
}

function showErrorState(message) {
  errorMsg.textContent = message;
  errorState.hidden    = false;
  responseBox.hidden   = true;
}

function validateFields() {
  let valid = true;

  if (!codeInput.value.trim()) {
    codeError.textContent = "Please paste your code before asking.";
    valid = false;
  } else {
    codeError.textContent = "";
  }

  if (!questionInput.value.trim()) {
    questionError.textContent = "Please enter a question.";
    valid = false;
  } else {
    questionError.textContent = "";
  }

  return valid;
}

// ── Core request ─────────────────────────────────────────────
async function doRequest() {
  const code     = codeInput.value.trim();
  const question = questionInput.value.trim();

  // Loading state
  askButton.disabled    = true;
  askButton.textContent = "Thinking...";
  responseBox.textContent = "";
  responseBox.classList.add("is-loading");
  showResponseBox();                        // ensure pre is visible for spinner

  try {
    const response = await fetch("http://localhost:5000/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, question }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    responseBox.textContent = data.response;
  } catch (error) {
    showErrorState(error.message);
  } finally {
    // Always restore button
    askButton.disabled    = false;
    askButton.textContent = "Ask DevPilot";
    responseBox.classList.remove("is-loading");
  }
}

// ── Event listeners ───────────────────────────────────────────
askButton.addEventListener("click", () => {
  if (!validateFields()) return;
  doRequest();
});

retryButton.addEventListener("click", () => {
  doRequest();
});

// Clear inline error as soon as the user starts fixing the field
codeInput.addEventListener("input",     () => { codeError.textContent     = ""; });
questionInput.addEventListener("input", () => { questionError.textContent = ""; });
