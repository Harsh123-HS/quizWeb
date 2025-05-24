import requests, base64, logging, time, random

def decode_base64_string(encoded_str):
    try:
        return base64.b64decode(encoded_str).decode('utf-8')
    except Exception:
        return encoded_str

def fetch_opentdb_questions(amount=5, category=9, difficulty="medium", retries=5, delay=2):
    for attempt in range(retries):
        response = requests.get("https://opentdb.com/api.php", params={
            "amount": amount,
            "category": category,
            "difficulty": difficulty,
            "type": "multiple",
            "encode": "base64"
        })
        if response.status_code == 200:
            data = response.json()
            if data.get("response_code") == 0:
                decoded = []
                for q in data["results"]:
                    question = decode_base64_string(q["question"])
                    correct = decode_base64_string(q["correct_answer"])
                    incorrect = [decode_base64_string(i) for i in q["incorrect_answers"]]
                    options = incorrect + [correct]
                    random.shuffle(options)
                    decoded.append({"question": question, "options": options, "correct_answer": correct})
                return decoded
        time.sleep(delay * (attempt + 1))
    return get_fallback_questions()

def get_fallback_questions():
    fallback = [
        {"question": "What is 2 + 2?", "correct_answer": "4", "incorrect_answers": ["3", "5", "22"]},
        {"question": "Who wrote 'Hamlet'?", "correct_answer": "William Shakespeare", "incorrect_answers": ["Dickens", "Tolstoy", "Twain"]}
    ]
    for q in fallback:
        q["options"] = q["incorrect_answers"] + [q["correct_answer"]]
        random.shuffle(q["options"])
        del q["incorrect_answers"]
    return fallback
