const askButton = document.getElementById("askBtn");

const questionInput = document.getElementById("question");

const answerDiv = document.getElementById("answer");

askButton.addEventListener("click", askQuestion);

async function askQuestion() {

    const question = questionInput.value.trim();

    if (!question) {

        alert("Please enter a question.");

        return;
    }

    answerDiv.innerHTML = "Thinking...";

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

    }

    catch (error) {

        console.error(error);

        answerDiv.innerHTML = "Something went wrong.";

    }

}