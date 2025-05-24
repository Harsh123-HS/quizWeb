# backend/main.py
from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Enum, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.hash import bcrypt
from pydantic import BaseModel, EmailStr, constr
from typing import Annotated
import enum, uuid
from utils import fetch_opentdb_questions
from typing import Annotated
from pydantic import constr

PasswordStr = Annotated[str, constr(min_length=6)]

# Database setup
DATABASE_URL = "sqlite:///./quiz.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# FastAPI app setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI is up and running!"}

# Enum for user roles
class RoleEnum(str, enum.Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"

# SQLAlchemy model
class User(Base):
    __tablename__ = "users"
    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

# Create DB tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for request body
class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: constr(min_length=6)
    role: RoleEnum

# Register endpoint
@app.post("/register")
def register_user(
    user: RegisterUser,
    db: Annotated[Session, Depends(get_db)]
):
    if db.query(User).filter_by(email=user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        name=user.name,
        email=user.email,
        password=bcrypt.hash(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

# Questions endpoint
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