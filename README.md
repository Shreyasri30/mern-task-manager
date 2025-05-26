# 🔧 Task Manager - MERN Stack Application

## Overview

This is a full-stack Task Management web app with:

- Role-based access (Admin, Manager, Member)
- Invite-based organization onboarding
- Task creation, assignment, status update
- Automatic expiry via cron jobs
- Dockerized for easy deployment

---

## Tech Stack

- ReactJS + Axios + React Router (Frontend)
- Node.js + Express + Mongoose (Backend)
- MongoDB (Database)
- Docker (Deployment)

---

## Roles & Permissions

| Role    | Permissions                          |
|---------|--------------------------------------|
| Admin   | Full access + Invite others          |
| Manager | Create/manage tasks                  |
| Member  | View & update own tasks only         |

---

## How to Run Locally

```bash
# 1. Clone the project
git clone <your-repo-url>
cd task-manager

# 2. Start with Docker
docker-compose up --build
