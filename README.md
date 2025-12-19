# Running the App Locally

## 1️⃣ Clone the repository
git clone <repo-url>
cd <your-project-folder>

## 2️⃣ Setup backend
1 Navigate to the backend folder (if separate):
cd backend

2 Install dependencies:
npm install

3 Create a .env file in the backend root with your environment variables. Example:
DB_URL= mongodb://localhost:27017/your-db
JWT_Sign =your_jwt_secret


4 Start the backend server:
npm run dev
