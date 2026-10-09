const codeInput     = document.getElementById("code");
const questionInput  = document.getElementById("question");
const askButton     = document.getElementById("askButton");
const copyButton    = document.getElementById("copyButton");
const codeError     = document.getElementById("code-error");
const questionError  = document.getElementById("question-error");
const retryButton   = document.getElementById("retryButton");

// Single panel + inner sections
const panel      = document.getElementById("response-panel");
const successBox = panel.querySelector(".rp-success");
const errorMsg   = document.getElementById("error-msg");

// ── State machine ─────────────────────────────────────────────
/**
 * Switch the response panel to one of four states.
 *   state   : "empty" | "loading" | "success" | "error"
 *   payload : { text }    for success
 *             { message } for error
 */
function setResponseState(state, payload = {}) {
  panel.dataset.state   = state;
  copyButton.hidden     = state !== "success";

  if (state === "success") {
    successBox.innerHTML = formatResponse(payload.text);
  }

  if (state === "error") {
    errorMsg.textContent = payload.message || "Something went wrong.";
  }
}

// ── Field validation ──────────────────────────────────────────
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

// ── Response formatter ────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;");
}

/**
 * Converts plain-text AI responses to structured HTML without a library.
 *   - Text between triple-backtick fences → <pre><code>
 *   - Paragraphs (double-newline separated) → <p>
 *   - Single newlines within a paragraph   → <br>
 *   - All text is HTML-escaped before insertion.
 */
function formatResponse(text) {
  const parts = text.split(/```(?:[^\n]*)?\n?/);
  let html = "";

  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      // Code block (inside fences)
      const code = escapeHtml(part.replace(/\n$/, ""));
      html += `<pre><code>${code}</code></pre>`;
    } else {
      // Prose (outside fences) — split on double newlines → <p>
      part.split(/\n{2,}/).forEach((para) => {
        const trimmed = para.trim();
        if (trimmed) {
          html += `<p>${escapeHtml(trimmed).replace(/\n/g, "<br>")}</p>`;
        }
      });
    }
  });

  return html || `<p>${escapeHtml(text)}</p>`;
}

// ── Core request ──────────────────────────────────────────────
async function doRequest() {
  askButton.disabled    = true;
  askButton.textContent = "Thinking...";
  setResponseState("loading");

  try {
    const response = await fetch("http://localhost:5000/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code:     codeInput.value.trim(),
        question: questionInput.value.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    setResponseState("success", { text: data.response });
  } catch (error) {
    setResponseState("error", { message: error.message });
  } finally {
    askButton.disabled    = false;
    askButton.textContent = "Ask DevPilot";
  }
}

// ── Copy to clipboard ─────────────────────────────────────────
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(successBox.innerText);
    copyButton.textContent = "✓ Copied!";
    copyButton.classList.add("copied");
  } catch {
    copyButton.textContent = "Failed";
  }

  setTimeout(() => {
    copyButton.textContent = "Copy";
    copyButton.classList.remove("copied");
  }, 2000);
});

// ── Event listeners ───────────────────────────────────────────
askButton.addEventListener("click", () => {
  if (!validateFields()) return;
  doRequest();
});

retryButton.addEventListener("click", () => {
  doRequest();
});

codeInput.addEventListener("input",     () => { codeError.textContent     = ""; });
questionInput.addEventListener("input", () => { questionError.textContent = ""; });
