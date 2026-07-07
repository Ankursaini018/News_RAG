"""
prompt.py
---------
Prompt template for News RAG.
"""

from langchain_core.prompts import ChatPromptTemplate

def get_prompt():

    return ChatPromptTemplate.from_template(
        """
You are an AI News Assistant.

Answer ONLY using the provided context.

If the answer cannot be found in the context, reply:

"I couldn't find this information in the indexed news articles."

Context:
{context}

Question:
{input}

Answer:
"""
    )

