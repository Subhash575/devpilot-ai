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

// ── Response formatter ────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Converts plain-text AI responses to structured HTML without a library.
 *   - Text between triple-backtick fences → <pre><code>
 *   - Paragraphs (double-newline separated) → <p>
 *   - Single newlines within a paragraph   → <br>
 *   - All text is HTML-escaped before insertion.
 */
function formatResponse(text) {
  // Split on opening/closing ``` fences (with optional language hint, e.g. ```js)
  const parts = text.split(/```(?:[^\n]*)?\n?/);
  let html = "";

  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      // ── Code block (odd index = inside fences) ───────────────
      const code = escapeHtml(part.replace(/\n$/, "")); // strip trailing newline
      html += `<pre><code>${code}</code></pre>`;
    } else {
      // ── Prose (even index = outside fences) ──────────────────
      part.split(/\n{2,}/).forEach((para) => {
        const trimmed = para.trim();
        if (trimmed) {
          // Preserve single line-breaks within a paragraph as <br>
          html += `<p>${escapeHtml(trimmed).replace(/\n/g, "<br>")}</p>`;
        }
      });
    }
  });

  // Fallback: if nothing was generated, wrap the whole thing in a <p>
  return html || `<p>${escapeHtml(text)}</p>`;
}

// ── Core request ─────────────────────────────────────────────
async function doRequest() {
  const code     = codeInput.value.trim();
  const question = questionInput.value.trim();

  // Loading state
  askButton.disabled   = true;
  askButton.textContent = "Thinking...";
  responseBox.innerHTML = "";               // clear previous content / placeholder
  responseBox.classList.add("is-loading");
  showResponseBox();                        // ensure response div is visible for spinner

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

    responseBox.innerHTML = formatResponse(data.response);
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
