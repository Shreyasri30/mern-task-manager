### Server Setup & Prerequisites

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Clone the repository
3. Set environment variables in `.env` file:
   - `MONGO_URI=mongodb://mongo:27017/taskmanager`
   - `JWT_SECRET=yourSecretKey`
4. Run `docker-compose up --build` to deploy backend, frontend, and MongoDB
