"""
rag_chain.py
------------
Creates the complete Retrieval-Augmented Generation pipeline.
"""

from dotenv import load_dotenv

from langchain_groq import ChatGroq

from langchain_classic.chains.combine_documents import (
    create_stuff_documents_chain
)

from langchain_classic.chains.retrieval import (
    create_retrieval_chain
)

import rag.prompt as prompt_module
import rag.retriever as retriever_module


load_dotenv()

MODEL_NAME = "llama-3.3-70b-versatile"

TEMPERATURE = 0


def create_llm():

    return ChatGroq(

    model=MODEL_NAME,

    temperature=TEMPERATURE

)


def create_document_chain(llm):

    prompt = prompt_module.get_prompt()

    return create_stuff_documents_chain(
        llm,
        prompt
    )


def create_rag_chain():

    retriever = retriever_module.get_retriever()

    llm = create_llm()

    document_chain = create_document_chain(llm)

    rag_chain = create_retrieval_chain(
        retriever,
        document_chain
    )

    return rag_chain


def ask_question(rag_chain, question):

    response = rag_chain.invoke(
        {
            "input": question
        }
    )

    sources = []

    for document in response["context"]:

        sources.append(
            {
                "title": document.metadata.get("title", "Unknown"),
                "url": document.metadata.get("url", "N/A"),
                "source": document.metadata.get("source", "BBC")
            }
        )

    answer = response["answer"]

    if "couldn't find" in answer.lower():
        sources = []

    return {
        "answer": answer,
        "sources": sources
    }


def display_sources(sources):

    print("\n📚 Sources\n")

    seen = set()

    for source in sources:

        key = (source["title"], source["url"])

        if key in seen:
            continue

        seen.add(key)

        print(f"• {source['title']}")
        print(source["url"])
        print()


def chat():

    rag_chain = create_rag_chain()

    print("=" * 70)
    print("📰 News RAG Assistant")
    print("Type 'exit' to quit.")
    print("=" * 70)

    while True:

        question = input("\nAsk > ").strip()

        if question.lower() == "exit":
            break

        result = ask_question(
            rag_chain,
            question
        )

        print("\n🤖 Answer\n")

        print(result["answer"])

        display_sources(
            result["sources"]
        )


if __name__ == "__main__":

    chat()