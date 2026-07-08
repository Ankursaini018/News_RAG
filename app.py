from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import sys

sys.path.append("src")

from rag.rag_chain import create_rag_chain
from rag.rag_chain import ask_question

from src.api_models import (
    QuestionRequest,
    QuestionResponse
)

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Loading News RAG...")

    app.state.rag_chain = create_rag_chain()

    print("News RAG Loaded!")

    yield

app = FastAPI(
    title="News RAG",
    version="1.0",
    lifespan=lifespan
)

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

templates = Jinja2Templates(directory="templates")


@app.get("/")
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request
        }
    )

@app.post("/ask")
async def ask_news(
    request: QuestionRequest,
    http_request: Request
):

    result = ask_question(
        http_request.app.state.rag_chain,
        request.question
    )

    return result