"""
retriever.py
------------
Creates a LangChain Retriever from the FAISS vector store.
"""

from langchain_core.vectorstores import VectorStoreRetriever

import processing.embeddings as embedding_module
import processing.vector_store as vector_store_module

SEARCH_TYPE = "similarity"

TOP_K = 4

def create_retriever(vector_store):

    retriever = vector_store.as_retriever(

        search_type=SEARCH_TYPE,

        search_kwargs={

            "k": TOP_K

        }

    )

    return retriever

def test_retriever(retriever):

    query = "Latest technology news"

    documents = retriever.invoke(query)

    print(f"Retrieved Documents : {len(documents)}")

    return documents

def display_results(documents):

    for i, doc in enumerate(documents, 1):

        print("=" * 80)

        print(f"Result {i}")

        print("=" * 80)

        print(doc.metadata["title"])

        print(doc.metadata["url"])

        print()

        print(doc.page_content[:400])

        print()

def get_retriever():

    chunks, embeddings = embedding_module.main()

    vector_store = vector_store_module.load_vector_store(
        embeddings
    )

    retriever = create_retriever(
        vector_store
    )

    return retriever

if __name__ == "__main__":

    retriever = get_retriever()

    documents = test_retriever(retriever)

    display_results(documents)