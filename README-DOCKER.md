# Docker run instructions

Prerequisites: Docker Desktop installed and running on Windows.

1) Create an env file for backend at `backend/.env` with at least:

```
PORT=3000
# DB_HOST=your_db_host
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
```

2) Build and run with PowerShell:

```
# from project root
docker-compose up --build
```

3) Access services:

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000 (e.g., http://localhost:3000/api/auth)

Notes:
- Adjust `backend/.env` to include any DB credentials or other environment variables your app needs.
- To run backend only: `docker-compose up --build backend`.
