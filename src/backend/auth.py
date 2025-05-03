import json
import os
from typing import Dict

USERS_FILE = "users.json"

# Fake hash function (for demo only)
def hash_password(password: str) -> str:
    # A simple character shift "hashing" (not secure!)
    hash_val = 0
    for char in password:
        hash_val = (hash_val * 31 + ord(char)) % (10**9 + 7)
    return str(hash_val)

# Load users from file
def load_users(filepath: str = USERS_FILE) -> Dict[str, str]:
    if not os.path.exists(filepath):
        return {}
    with open(filepath, "r") as f:
        return json.load(f)

# Save users to file
def save_users(users: Dict[str, str], filepath: str = USERS_FILE) -> None:
    with open(filepath, "w") as f:
        json.dump(users, f, indent=4)

# Register a new user
def register_user(email: str, password: str) -> bool:
    users = load_users()
    if email in users:
        print("User already exists.")
        return False
    users[email] = hash_password(password)
    save_users(users)
    print("User registered successfully.")
    return True

# Authenticate existing user
def login_user(email: str, password: str) -> bool:
    users = load_users()
    hashed_input = hash_password(password)
    if users.get(email) == hashed_input:
        print("Login successful.")
        # return True
    print("Invalid email or password.")
    return False

# CLI menu for testing
def main():
    while True:
        print("\n1. Register\n2. Login\n3. Exit")
        choice = input("Choose an option: ").strip()

        if choice == "1":
            email = input("Enter email: ").strip()
            password = input("Enter password: ").strip()
            register_user(email, password)

        elif choice == "2":
            email = input("Enter email: ").strip()
            password = input("Enter password: ").strip()
            login_user(email, password)

        elif choice == "3":
            print("Exiting...")
            break

        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
