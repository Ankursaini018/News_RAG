const askButton = document.getElementById("askBtn");

const questionInput = document.getElementById("question");

const answerDiv = document.getElementById("answer");

const loading = document.getElementById("loading");

const answerCard = document.getElementById("answer-card");

const sourcesCard = document.getElementById("sources-card");

const sourcesDiv = document.getElementById("sources");

askButton.addEventListener("click", askQuestion);

async function askQuestion() {

    const question = questionInput.value.trim();

    if(question===""){

        alert("Enter a question.");

        return;

    }

    loading.style.display="block";

    answerCard.style.display="none";

    sourcesCard.style.display="none";

    answerDiv.innerHTML="";

    sourcesDiv.innerHTML="";

    askButton.disabled=true;

    askButton.innerText="Thinking...";

    try{

        const response=await fetch("/ask",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                question:question

            })

        });

        const data=await response.json();

        answerCard.style.display="block";

        answerDiv.innerHTML=data.answer;

        if(data.sources.length){

            sourcesCard.style.display="block";

            data.sources.forEach(source=>{

                sourcesDiv.innerHTML+=`

                <div class="source">

                    <strong>${source.title}</strong>

                    <br>

                    <a href="${source.url}" target="_blank">

                    ${source.url}

                    </a>

                </div>

                `;

            });

        }

    }

    catch(err){

        answerCard.style.display="block";

        answerDiv.innerHTML="Something went wrong.";

    }

    loading.style.display="none";

    askButton.disabled=false;

    askButton.innerHTML="🚀 Ask AI";

}