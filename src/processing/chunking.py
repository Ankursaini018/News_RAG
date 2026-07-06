"""
chunking.py
-----------
Splits LangChain documents into smaller chunks.
"""

from langchain_text_splitters import RecursiveCharacterTextSplitter

import processing.document_loader as document_loader

def create_text_splitter():

    splitter = RecursiveCharacterTextSplitter(

        chunk_size=1000,

        chunk_overlap=200,

        separators=[

            "\n\n",

            "\n",

            ". ",

            " ",

            ""

        ]

    )

    return splitter

def split_documents(documents):

    splitter = create_text_splitter()

    chunks = splitter.split_documents(documents)

    return chunks

def main():

    documents = document_loader.main()

    chunks = split_documents(documents)

    print(f"Original Documents : {len(documents)}")

    print(f"Total Chunks : {len(chunks)}")

    return chunks

if __name__ == "__main__":

    main()

    