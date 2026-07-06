"""
vector_store.py
---------------
Creates and manages the FAISS vector database.
"""

from pathlib import Path

from langchain_community.vectorstores import FAISS

import processing.embeddings as embedding_module

BASE_DIR = Path(__file__).resolve().parents[2]

VECTOR_DB_PATH = BASE_DIR / "faiss_index"

def create_vector_store(chunks, embeddings):

    vector_store = FAISS.from_documents(

        documents=chunks,

        embedding=embeddings

    )

    return vector_store

def save_vector_store(vector_store):

    vector_store.save_local(VECTOR_DB_PATH)

    print(f"Vector Store saved at:\n{VECTOR_DB_PATH}")

def load_vector_store(embeddings):

    vector_store = FAISS.load_local(

        VECTOR_DB_PATH,

        embeddings,

        allow_dangerous_deserialization=True

    )

    return vector_store

def verify_vector_store(vector_store):

    print(f"Indexed Chunks : {vector_store.index.ntotal}")


def main():

    chunks, embeddings = embedding_module.main()

    vector_store = create_vector_store(
        chunks,
        embeddings
    )

    save_vector_store(vector_store)

    vector_store = load_vector_store(
        embeddings
    )

    verify_vector_store(vector_store)

    return vector_store

if __name__ == "__main__":

    main()
            