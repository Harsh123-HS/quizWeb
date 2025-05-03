-- 1. Users Table (Students, Teachers, Admins)
CREATE TABLE IF NOT EXISTS users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Quizzes Table (Metadata Only, No Questions Stored)
CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    api_endpoint VARCHAR(512) NOT NULL,
    teacher_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. User Quiz Attempts
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
    attempt_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    quiz_id CHAR(36) NOT NULL,
    score INT DEFAULT 0,
    total_questions INT NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

-- 4. User Answers (Storing API-Fetched Question IDs)
CREATE TABLE IF NOT EXISTS user_answers (
    answer_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    attempt_id CHAR(36) NOT NULL,
    question_api_id VARCHAR(255) NOT NULL,
    selected_option VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (attempt_id) REFERENCES user_quiz_attempts(attempt_id) ON DELETE CASCADE
);

-- 5. Login History
CREATE TABLE IF NOT EXISTS login_history (
    login_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

