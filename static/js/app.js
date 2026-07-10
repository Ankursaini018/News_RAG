const askButton = document.getElementById("askBtn");
const questionInput = document.getElementById("question");
const loading = document.getElementById("loading");
const chatHistory = document.getElementById("chat-history");
const suggestionChips = document.querySelectorAll(".chip");

askButton.addEventListener("click", askQuestion);

questionInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        askQuestion();
    }
});

suggestionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        questionInput.value = chip.dataset.question || "";
        questionInput.focus();
    });
});

function addUserMessage(question) {
    chatHistory.innerHTML += `
        <div class="message user-message">
            <div class="message-header">👤 You</div>
            <div class="message-body">${question}</div>
        </div>
    `;
}

function addAIMessage(answer, sources = []) {
    let sourcesMarkup = "";

    if (Array.isArray(sources) && sources.length) {
        sourcesMarkup = `
            <div class="sources">
                <h4>📚 Sources</h4>
                ${sources.map((source, index) => `
                    <div class="source">
                        <strong>${index + 1}. ${source.title || "Source"}</strong>
                        <a href="${source.url || "#"}" target="_blank" rel="noreferrer">${source.url || "Open source"}</a>
                    </div>
                `).join("")}
            </div>
        `;
    }

    chatHistory.innerHTML += `
        <div class="message ai-message">
            <div class="message-header">🤖 News RAG</div>
            <div class="message-body">${answer || "No answer available yet."}</div>
            ${sourcesMarkup}
        </div>
    `;
}

async function askQuestion() {
    const question = questionInput.value.trim();

    if (!question) {
        questionInput.focus();
        return;
    }

    addUserMessage(question);
    questionInput.value = "";

    loading.classList.remove("hidden");
    askButton.disabled = true;
    askButton.textContent = "Thinking...";
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const data = await response.json();
        addAIMessage(data.answer, data.sources);
    } catch (error) {
        addAIMessage("I could not reach the assistant right now. Please try again in a moment.", []);
    } finally {
        loading.classList.add("hidden");
        askButton.disabled = false;
        askButton.textContent = "Ask AI";
    }
}