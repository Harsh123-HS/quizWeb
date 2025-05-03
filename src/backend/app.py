from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

@app.route("/questions", methods=["GET"])
def get_questions():
    conn = sqlite3.connect("quiz.db")
    cursor = conn.cursor()

    category = request.args.get("category")
    difficulty = request.args.get("difficulty")
    amount = int(request.args.get("amount", 5))

    query = "SELECT question, options, correct_answer, category, difficulty FROM questions WHERE 1=1"
    params = []

    if category:
        query += " AND category = ?"
        params.append(category)
    if difficulty:
        query += " AND difficulty = ?"
        params.append(difficulty)

    query += " LIMIT ?"
    params.append(amount)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    questions = []
    for row in rows:
        q, opts, ans, cat, diff = row
        questions.append({
            "question": q,
            "options": opts.split("|"),
            "correct_answer": ans,
            "category": cat,
            "difficulty": diff
        })

    return jsonify({"questions": questions})
