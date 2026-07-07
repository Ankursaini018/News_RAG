"""
rag_chain.py
------------
Creates the complete Retrieval-Augmented Generation pipeline.
"""

import os

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
def create_llm():

    return ChatGroq(

        model=MODEL_NAME,

        temperature=0

    )

def create_document_chain(llm):

    prompt = prompt_module.get_prompt()

    return create_stuff_documents_chain(

        llm,

        prompt

    )

def create_rag_chain():

    retriever = retriever_module.main()

    llm = create_llm()

    document_chain = create_document_chain(
        llm
    )

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

    return response

def chat():

    rag_chain = create_rag_chain()

    print("=" * 70)

    print("📰 News RAG Assistant")

    print("Type 'exit' to quit.")

    print("=" * 70)

    while True:

        question = input("\nAsk > ")

        if question.lower() == "exit":

            break

        response = ask_question(

            rag_chain,

            question

        )

        print("\nAnswer\n")

        print(response["answer"])

if __name__ == "__main__":

    chat()        