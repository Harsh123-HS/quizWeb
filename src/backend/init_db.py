import sqlite3
conn = sqlite3.connect('quiz.db')
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT,
        options TEXT,
        correct_answer TEXT,
        category TEXT,
        difficulty TEXT
    )
''')
cursor.execute('''
    INSERT INTO questions (question, options, correct_answer, category, difficulty)
    VALUES (?, ?, ?, ?, ?)
''', (
    "What is the capital of France?",
    "Paris|London|Berlin|Madrid",
    "Paris",
    "General Knowledge",
    "Easy"
))
conn.commit()
conn.close()