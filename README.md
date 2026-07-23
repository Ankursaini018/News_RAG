# 📰 News RAG Assistant

An intelligent Retrieval-Augmented Generation (RAG) application that extracts the latest BBC News articles, stores them in a FAISS vector database, and answers user questions using **LangChain** and **Groq LLM**.

The application features a modern FastAPI frontend with a ChatGPT-style interface, allowing users to ask questions about the latest news and receive context-aware answers with source references.

---

# 🚀 Features

- 📰 Extracts latest BBC News articles
- 🔗 Crawls complete news articles
- 📄 Converts articles into LangChain Documents
- ✂️ Intelligent document chunking
- 🧠 Sentence Transformer Embeddings
- 🗂️ FAISS Vector Database
- 🔍 Semantic Similarity Search
- 🤖 Retrieval-Augmented Generation (RAG)
- ⚡ Groq Llama-3.3-70B Integration
- 🌐 FastAPI Backend
- 🎨 Modern Responsive Frontend
- 💬 ChatGPT-style Chat Interface
- 📚 Source References with Every Answer
- ⌨️ Enter to Send
- 🔄 Loading Animation
- 📱 Responsive Design

---

# 📂 Project Structure

```text
News_RAG/
│
├── app.py
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
├── src/
│   ├── api_models.py
│   │
│   ├── crawler/
│   │   ├── homepage_loader.py
│   │   ├── article_links.py
│   │   └── article_loader.py
│   │
│   ├── processing/
│   │   ├── document_loader.py
│   │   ├── chunking.py
│   │   ├── embeddings.py
│   │   └── vector_store.py
│   │
│   └── rag/
│       ├── retriever.py
│       ├── prompt.py
│       └── rag_chain.py
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── vector_store/
│
├── notebooks/
│
├── requirements.txt
│
├── .env
│
└── README.md
```

---

# 🛠 Tech Stack

- Python
- FastAPI
- LangChain
- LangChain Community
- LangChain Groq
- FAISS
- HuggingFace Embeddings
- BeautifulSoup
- Requests
- Jinja2
- HTML
- CSS
- JavaScript
- Groq API

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Ankursaini018/News_RAG.git

cd News_RAG
```

## Create Virtual Environment

### Windows

```bash
python -m venv venv
```

Activate

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Create .env

Create a file named

```text
.env
```

Add

```env
GROQ_API_KEY=your_groq_api_key
```

---

# 📥 Build the Knowledge Base

Run these scripts in order:

## Step 1

```bash
python -m src.crawler.homepage_loader
```

Downloads BBC homepage.

---

## Step 2

```bash
python -m src.crawler.article_links
```

Extracts article links.

---

## Step 3

```bash
python -m src.crawler.article_loader
```

Downloads complete BBC articles.

---

## Step 4

```bash
python -m src.processing.document_loader
```

Creates LangChain Documents.

---

## Step 5

```bash
python -m src.processing.chunking
```

Splits documents into chunks.

---

## Step 6

```bash
python -m src.processing.embeddings
```

Creates sentence embeddings.

---

## Step 7

```bash
python -m src.processing.vector_store
```

Creates the FAISS vector database.

# 🚀 Run the Application

Start the FastAPI server

```bash
uvicorn app:app --reload
```

Open

```text
http://127.0.0.1:8000
```

API Documentation

```text
http://127.0.0.1:8000/docs
```

---

# 💬 Example Questions

- What is today's latest news?
- Latest AI news
- What happened in Ukraine?
- Tell me about the latest technology news.
- Summarize today's headlines.
- What is happening in Europe?
- What is the latest business news?

---

# 🖼 Current Application Features

### Backend

- BBC News Scraper
- Article Downloader
- LangChain Documents
- Chunking Pipeline
- Sentence Embeddings
- FAISS Vector Database
- Semantic Retrieval
- Groq LLM
- Retrieval-Augmented Generation

### Frontend

- FastAPI
- Responsive UI
- Chat Interface
- Loading Animation
- Source References
- Clickable News Links
- Enter to Send
- Error Handling

---

# 🔄 Workflow

```text
BBC Website
      │
      ▼
Homepage Loader
      │
      ▼
Article Link Extraction
      │
      ▼
Article Downloader
      │
      ▼
LangChain Documents
      │
      ▼
Chunking
      │
      ▼
Embeddings
      │
      ▼
FAISS Vector Store
      │
      ▼
Retriever
      │
      ▼
Groq LLM
      │
      ▼
FastAPI
      │
      ▼
Frontend
```

---

# 📌 Future Improvements

- Multiple News Sources (Reuters, CNN, etc.)
- Streaming Responses
- Export Chat
- Dark Mode
- Conversation Memory
- Authentication
- Cloud Deployment

---

# 👨‍💻 Author

**Ankur Saini**

AI/ML | Generative AI | Data Science

GitHub

https://github.com/Ankursaini018

LinkedIn

www.linkedin.com/in/ankur-saini-596173374
