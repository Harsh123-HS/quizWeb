
# === Flask + SQLite app.py ===
from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/questions", methods=["GET"])
def get_questions():
    conn = sqlite3.connect('quiz.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM questions")
    rows = cursor.fetchall()
    conn.close()

    questions = []
    for row in rows:
        questions.append({
            "id": row[0],
            "question": row[1],
            "options": row[2].split("|"),
            "correct_answer": row[3],
            "category": row[4],
            "difficulty": row[5]
        })
    return jsonify({"questions": questions})

@app.route("/questions", methods=["POST"])
def add_question():
    data = request.get_json()
    conn = sqlite3.connect('quiz.db')
    cursor = conn.cursor()
    cursor.execute('''INSERT INTO questions (question, options, correct_answer, category, difficulty) 
                      VALUES (?, ?, ?, ?, ?)''', 
                      (data["question"], "|".join(data["options"]), data["correct_answer"], data["category"], data["difficulty"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Question added successfully!"}), 201