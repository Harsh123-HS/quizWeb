
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from models import QuizAttempt

load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def save_quiz_attempt(attempt: QuizAttempt):
    response = supabase.table("user_quiz_attempts").insert(attempt.dict()).execute()
    return response.data