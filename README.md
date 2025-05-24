the valid quiz fields are
General Knowledge
Entertainment: Books
Entertainment: Film
Entertainment: Music
Entertainment: Musicals & Theatres
Entertainment: Television
Entertainment: Video Games
Entertainment: Board Games
Science & Nature
Science: Computers
Science: Mathematics
Mythology
Sports
Geography
History
Politics
Art
Celebrities
Animals
Vehicles
Entertainment: Comics
Science: Gadgets
Entertainment: Japanese Anime & Manga
Entertainment: Cartoon & Animations


python -m venv venv 
.\venv\Scripts\Activate   
cd C:\Users\hp\first-react\viteproject\projects\quizWeb\src\backend        
 pip install fastapi uvicorn sqlalchemy passlib[bcrypt] pydantic python-dotenv requests  
 uvicorn main:app --reload --port 5000                                                                   