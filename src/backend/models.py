from pydantic import BaseModel

class QuizAttempt(BaseModel):
    user_id: str
    quiz_id: str
    score: int
    total_questions: int
