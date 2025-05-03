import requests
import base64
import logging
import time
import random

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def decode_base64_string(encoded_str):
    try:
        decoded_bytes = base64.b64decode(encoded_str)
        return decoded_bytes.decode('utf-8')
    except Exception as e:
        logger.error(f"Error decoding base64: {e}")
        return encoded_str  # Return original string if decoding fails

def fetch_opentdb_questions(amount=5, category=9, difficulty="medium", retries=5, delay=2):
    url = "https://opentdb.com/api.php"
    params = {
        "amount": amount,
        "category": category,
        "difficulty": difficulty,
        "type": "multiple",
        "encode": "base64"
    }

    for attempt in range(1, retries + 1):
        logger.info(f"📡 Fetching from OpenTDB with params: {params} (Attempt {attempt})")
        response = requests.get(url, params=params)
        logger.info(f"🔎 Status code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            if data.get("response_code") == 0:
                decoded_questions = []
                for item in data.get("results", []):
                    question_text = decode_base64_string(item.get("question"))
                    correct_answer = decode_base64_string(item.get("correct_answer"))
                    incorrect_answers = [decode_base64_string(ans) for ans in item.get("incorrect_answers", [])]

                    # 🔥 Combine and shuffle options
                    options = incorrect_answers + [correct_answer]
                    random.shuffle(options)

                    decoded_questions.append({
                        "question": question_text,
                        "options": options,
                        "correct_answer": correct_answer
                    })
                return decoded_questions
            else:
                logger.warning(f"⚠️ OpenTDB response code: {data.get('response_code')}")
                break

        elif response.status_code == 429:
            wait = delay * attempt  # exponential backoff
            logger.warning(f"⚠️ Hit rate limit (429). Retrying in {wait} seconds...")
            time.sleep(wait)
            continue

        else:
            logger.warning(f"⚠️ Unexpected status code: {response.status_code}")
            break

    logger.warning("⚠️ Using fallback questions due to failure.")
    return get_fallback_questions()

def get_fallback_questions():
    questions = [
        {
            "question": "What is the capital of France?",
            "correct_answer": "Paris",
            "incorrect_answers": ["London", "Berlin", "Rome"]
        },
        {
            "question": "What is 2 + 2?",
            "correct_answer": "4",
            "incorrect_answers": ["3", "5", "22"]
        },
        {
            "question": "Who wrote 'Hamlet'?",
            "correct_answer": "William Shakespeare",
            "incorrect_answers": ["Charles Dickens", "Leo Tolstoy", "Mark Twain"]
        },
        {
            "question": "What is the boiling point of water at sea level?",
            "correct_answer": "100°C",
            "incorrect_answers": ["90°C", "80°C", "70°C"]
        },
        {
            "question": "Which planet is known as the Red Planet?",
            "correct_answer": "Mars",
            "incorrect_answers": ["Venus", "Jupiter", "Saturn"]
        }
    ]

    for q in questions:
        options = q["incorrect_answers"] + [q["correct_answer"]]
        random.shuffle(options)
        q["options"] = options
        del q["incorrect_answers"]  # Remove unused field

    return questions
