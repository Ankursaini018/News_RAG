"""
embeddings.py
-------------
Creates HuggingFace embeddings for document chunks.
"""

from langchain_huggingface import HuggingFaceEmbeddings

import processing.chunking as chunking

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

def create_embedding_model():

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL
    )

    return embeddings

def test_embedding(embeddings):

    vector = embeddings.embed_query(
        "Artificial Intelligence"
    )

    print(f"Embedding Dimension : {len(vector)}")

    return vector

def main():

    chunks = chunking.main()

    embeddings = create_embedding_model()

    test_embedding(embeddings)

    print(f"Chunks Ready : {len(chunks)}")

    return chunks, embeddings

if __name__ == "__main__":

    main()
    