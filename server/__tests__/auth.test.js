const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role, organization } = req.body;

  if (!name || !email || !password || !role || !organization) {
    return res.status(400).json({ message: "Missing fields" });
  }

  return res.status(201).json({ message: "User created" });
});

describe("POST /api/auth/register", () => {
  it("should register a user with valid data", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        role: "member",
        organization: "oracle"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User created");
  });

  it("should return error for missing fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com" }); 

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Missing fields");
  });
});
