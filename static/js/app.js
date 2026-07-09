const askButton = document.getElementById("askBtn");
const questionInput = document.getElementById("question");

const loading = document.getElementById("loading");

const chatHistory = document.getElementById("chat-history");

/* -----------------------------------
   Ask Button
----------------------------------- */

askButton.addEventListener("click", askQuestion);

/* -----------------------------------
   Press Enter to Send
----------------------------------- */

questionInput.addEventListener("keydown", function(event){

    if(event.key==="Enter" && !event.shiftKey){

        event.preventDefault();

        askQuestion();

    }

});

/* -----------------------------------
   Add User Message
----------------------------------- */

function addUserMessage(question){

    chatHistory.innerHTML += `

    <div class="message user-message">

        <div class="message-header">

            👤 You

        </div>

        <div class="message-body">

            ${question}

        </div>

    </div>

    `;

}

/* -----------------------------------
   Add AI Message
----------------------------------- */

function addAIMessage(answer,sources){

    let html="";

    if(sources.length){

        html+=`

        <div class="sources">

            <h4>📚 Sources</h4>

        `;

        sources.forEach((source,index)=>{

            html+=`

            <div class="source">

                <strong>${index+1}. ${source.title}</strong>

                <br>

                <a href="${source.url}" target="_blank">

                    ${source.url}

                </a>

            </div>

            `;

        });

        html+=`</div>`;

    }

    chatHistory.innerHTML += `

    <div class="message ai-message">

        <div class="message-header">

            🤖 News RAG

        </div>

        <div class="message-body">

            ${answer}

        </div>

        ${html}

    </div>

    `;

}

/* -----------------------------------
   Ask Question
----------------------------------- */

async function askQuestion(){

    const question=questionInput.value.trim();

    if(question===""){

        alert("Please enter a question.");

        return;

    }

    addUserMessage(question);

    questionInput.value="";

    loading.classList.remove("hidden");

    askButton.disabled=true;

    askButton.innerHTML="⏳ Thinking...";

    chatHistory.scrollTop=chatHistory.scrollHeight;

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

        if(!response.ok){

            throw new Error("Server Error");

        }

        const data=await response.json();

        addAIMessage(

            data.answer,

            data.sources

        );

    }

    catch(error){

        chatHistory.innerHTML+=`

        <div class="message ai-message">

            <div class="message-header">

                ⚠ Error

            </div>

            <div class="message-body">

                Unable to contact News RAG.

            </div>

        </div>

        `;

    }

    finally{

        loading.classList.add("hidden");

        askButton.disabled=false;

        askButton.innerHTML="🚀 Ask AI";

        window.scrollTo({

            top:document.body.scrollHeight,

            behavior:"smooth"

        });

    }

}