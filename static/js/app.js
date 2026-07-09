const askButton = document.getElementById("askBtn");
const questionInput = document.getElementById("question");

const answerDiv = document.getElementById("answer");
const sourcesDiv = document.getElementById("sources");

askButton.addEventListener("click", askQuestion);

async function askQuestion() {

    const question = questionInput.value.trim();

    if (!question) {
        alert("Please enter a question.");
        return;
    }

    answerDiv.innerHTML = "⏳ Thinking...";
    sourcesDiv.innerHTML = "";

    try {

        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        answerDiv.innerHTML = data.answer;

        let html = "";

        data.sources.forEach((source, index) => {

            html += `
                <div class="source">
                    <strong>${index + 1}. ${source.title}</strong><br>
                    <a href="${source.url}" target="_blank">
                        ${source.url}
                    </a>
                </div>
            `;

        });

        sourcesDiv.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        answerDiv.innerHTML = "Something went wrong.";

    }

}