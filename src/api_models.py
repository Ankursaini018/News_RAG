from pydantic import BaseModel


class QuestionRequest(BaseModel):
    question: str


class Source(BaseModel):
    title: str
    url: str
    source: str


class QuestionResponse(BaseModel):
    answer: str
    sources: list[Source]