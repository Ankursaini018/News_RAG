const askButton = document.getElementById("askBtn");
const clearBtn = document.getElementById("clearBtn");
const clearInputBtn = document.getElementById("clearInputBtn");
const questionInput = document.getElementById("question");
const loading = document.getElementById("loading");
const chatHistory = document.getElementById("chat-history");
const emptyState = document.getElementById("emptyState");
const promptBox = document.getElementById("promptBox");
const suggestionChips = document.querySelectorAll(".chip");
const parallaxStage = document.querySelector("[data-parallax]");

let isAsking = false;

askButton.addEventListener("click", askQuestion);

if (clearBtn) {
    clearBtn.addEventListener("click", clearChat);
}

if (clearInputBtn) {
    clearInputBtn.addEventListener("click", () => {
        questionInput.value = "";
        autoResizeTextarea();
        questionInput.focus();
    });
}

questionInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        askQuestion();
    }
});

questionInput.addEventListener("input", autoResizeTextarea);

suggestionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        questionInput.value = chip.dataset.question || "";
        autoResizeTextarea();
        questionInput.focus();
    });
});

chatHistory.addEventListener("click", async (event) => {
    const copyBtn = event.target.closest(".copy-btn");
    if (copyBtn) {
        const text = copyBtn._copyText || copyBtn.getAttribute("data-copy") || "";
        try {
            await navigator.clipboard.writeText(text);
            copyBtn.classList.add("copied");
            copyBtn.textContent = "Copied";
            setTimeout(() => {
                copyBtn.classList.remove("copied");
                copyBtn.innerHTML = copyButtonLabel();
            }, 1600);
        } catch (error) {
            copyBtn.textContent = "Copy failed";
            setTimeout(() => {
                copyBtn.innerHTML = copyButtonLabel();
            }, 1600);
        }
        return;
    }

    const toggle = event.target.closest(".sources-toggle");
    if (toggle) {
        const sources = toggle.closest(".sources");
        if (sources) {
            sources.classList.toggle("open");
            const expanded = sources.classList.contains("open");
            toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        }
    }
});

if (parallaxStage) {
    const visual = parallaxStage.querySelector(".hero-visual");
    if (visual) {
        parallaxStage.addEventListener("mousemove", (event) => {
            const rect = parallaxStage.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            visual.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translate3d(${x * 12}px, ${y * 10}px, 0)`;
        });

        parallaxStage.addEventListener("mouseleave", () => {
            visual.style.transform = "rotateY(0deg) rotateX(0deg) translate3d(0, 0, 0)";
        });
    }
}

function copyButtonLabel() {
    return `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copy Answer`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatMarkdown(text) {
    let html = escapeHtml(text || "");

    html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
        return `<pre><code>${code.trim()}</code></pre>`;
    });

    html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/(^|[^\*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    html = html.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
        if (html.includes(`href="${url}"`)) {
            return url;
        }
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    const lines = html.split("\n");
    const built = [];
    let inList = false;

    lines.forEach((line) => {
        const listMatch = line.match(/^\s*[-•]\s+(.+)$/) || line.match(/^\s*\d+\.\s+(.+)$/);
        if (listMatch) {
            if (!inList) {
                built.push("<ul>");
                inList = true;
            }
            built.push(`<li>${listMatch[1]}</li>`);
            return;
        }

        if (inList) {
            built.push("</ul>");
            inList = false;
        }

        if (line.trim() === "") {
            built.push("<br>");
        } else if (!line.startsWith("<pre>") && !line.startsWith("</pre>")) {
            built.push(`<p>${line}</p>`);
        } else {
            built.push(line);
        }
    });

    if (inList) {
        built.push("</ul>");
    }

    return built.join("");
}

function formatTime(date = new Date()) {
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function hideEmptyState() {
    if (emptyState) {
        emptyState.classList.add("hidden");
    }
}

function showEmptyStateIfNeeded() {
    if (!emptyState) {
        return;
    }

    const hasMessages = chatHistory.querySelector(".message-row");
    emptyState.classList.toggle("hidden", Boolean(hasMessages));
}

function getFavicon(url) {
    try {
        const hostname = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`;
    } catch (error) {
        return "https://www.google.com/s2/favicons?domain=bbc.com&sz=64";
    }
}

function shortenUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.hostname.replace(/^www\./, "") + parsed.pathname.replace(/\/$/, "");
    } catch (error) {
        return url || "Open source";
    }
}

function scrollChatToBottom() {
    requestAnimationFrame(() => {
        chatHistory.scrollTo({
            top: chatHistory.scrollHeight,
            behavior: "smooth"
        });
    });
}

function autoResizeTextarea() {
    questionInput.style.height = "auto";
    questionInput.style.height = `${Math.min(questionInput.scrollHeight, 220)}px`;
}

function clearChat() {
    chatHistory.querySelectorAll(".message-row").forEach((node) => node.remove());
    showEmptyStateIfNeeded();
    questionInput.value = "";
    autoResizeTextarea();
    questionInput.focus();
}

function addUserMessage(question) {
    hideEmptyState();

    const row = document.createElement("div");
    row.className = "message-row user";
    row.innerHTML = `
        <div class="avatar user" aria-hidden="true">You</div>
        <div class="bubble">
            <div class="bubble-meta">
                <span class="name">You</span>
                <time>${formatTime()}</time>
            </div>
            <div class="bubble-body">
                <div class="message-body">${escapeHtml(question)}</div>
            </div>
        </div>
    `;

    chatHistory.appendChild(row);
    scrollChatToBottom();
}

function renderSources(sources) {
    if (!Array.isArray(sources) || !sources.length) {
        return "";
    }

    const cards = sources.map((source, index) => {
        const title = escapeHtml(source.title || `Source ${index + 1}`);
        const url = source.url || "#";
        const safeUrl = escapeHtml(url);
        const favicon = escapeHtml(getFavicon(url));
        const displayUrl = escapeHtml(shortenUrl(url));

        return `
            <a class="source-card" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
                <img class="source-favicon" src="${favicon}" alt="" loading="lazy" width="36" height="36">
                <div class="source-text">
                    <strong>${index + 1}. ${title}</strong>
                    <span>${displayUrl}</span>
                </div>
                <span class="source-open" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z"/></svg>
                </span>
            </a>
        `;
    }).join("");

    return `
        <div class="sources">
            <button class="sources-toggle" type="button" aria-expanded="false">
                <span>Sources · ${sources.length}</span>
                <span class="chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
                </span>
            </button>
            <div class="sources-list">
                ${cards}
            </div>
        </div>
    `;
}

function addAIMessage(answer, sources = []) {
    hideEmptyState();

    const rawAnswer = answer || "No answer available yet.";
    const row = document.createElement("div");
    row.className = "message-row ai";
    row.innerHTML = `
        <div class="avatar ai" aria-hidden="true">AI</div>
        <div class="bubble">
            <div class="bubble-meta">
                <span class="name">News RAG</span>
                <time>${formatTime()}</time>
            </div>
            <div class="bubble-body answer-card">
                <div class="message-body">${formatMarkdown(rawAnswer)}</div>
                <div class="message-actions">
                    <button class="copy-btn" type="button">
                        ${copyButtonLabel()}
                    </button>
                </div>
                ${renderSources(sources)}
            </div>
        </div>
    `;

    const copyBtn = row.querySelector(".copy-btn");
    if (copyBtn) {
        copyBtn._copyText = rawAnswer;
    }

    chatHistory.appendChild(row);
    scrollChatToBottom();
}

async function askQuestion() {
    if (isAsking) {
        return;
    }

    const question = questionInput.value.trim();

    if (!question) {
        questionInput.focus();
        if (promptBox) {
            promptBox.style.transform = "translateX(-4px)";
            setTimeout(() => {
                promptBox.style.transform = "translateX(4px)";
                setTimeout(() => {
                    promptBox.style.transform = "";
                }, 80);
            }, 80);
        }
        return;
    }

    isAsking = true;
    addUserMessage(question);
    questionInput.value = "";
    autoResizeTextarea();

    loading.classList.remove("hidden");
    askButton.disabled = true;
    askButton.querySelector(".btn-label").textContent = "Thinking...";
    scrollChatToBottom();

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
        askButton.querySelector(".btn-label").textContent = "Ask AI";
        isAsking = false;
        scrollChatToBottom();
        questionInput.focus();
    }
}

autoResizeTextarea();
showEmptyStateIfNeeded();
