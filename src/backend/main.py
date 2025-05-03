# /main.py
from fastapi import FastAPI, Query, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Enum, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.hash import bcrypt
from pydantic import BaseModel, EmailStr, constr
import enum
import uuid
from utils import fetch_opentdb_questions
from pydantic import BaseModel, EmailStr, constr, Field

DATABASE_URL = "mysql+pymysql://root:ROOT@localhost:3306/QuizApp"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RoleEnum(str, enum.Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

Base.metadata.create_all(bind=engine)

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schema for input validation


# Schema for input validation
class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: constr(min_length=6)  # This line remains unchanged, but use it correctly in Field
    role: RoleEnum


@app.post("/register")
def register_user(user: RegisterUser, db: Session = Depends(get_db)):
    exists = db.query(User).filter_by(email=user.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = bcrypt.hash(user.password)
    new_user = User(name=user.name, email=user.email, password=hashed_pw, role=user.role)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@app.get("/questions")
def get_questions(
    amount: int = Query(5),
    category: int = Query(9),
    difficulty: str = Query("medium")
):
    raw_questions = fetch_opentdb_questions(amount, category, difficulty)
    if not raw_questions:
        raise HTTPException(status_code=503, detail="Failed to fetch questions from OpenTDB.")
    return {"questions": raw_questions}
