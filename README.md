# Running the App Locally

This guide explains how to run the **nuaDrive** full-stack app locally (React + Vite frontend, Express backend, MongoDB).

## Installation

 1️⃣ Clone the repository

```bash
git clone <repo-url>
cd <your-project-folder>
```

 2️⃣ Setup backend

```bash
1 Navigate to the backend folder (if separate):
cd backend

2 Install dependencies:
npm install

3 Create a .env file in the backend root with your environment variables. Example:

DB_URL= mongodb://localhost:27017/your-db
JWT_Sign =your_jwt_secret
```
 3️⃣ Start the backend server

```bash
npm run dev
```
## License

[MIT](https://choosealicense.com/licenses/mit/)
