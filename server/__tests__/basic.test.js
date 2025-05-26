const request = require("supertest");
const express = require("express");

const app = express();
app.get("/", (req, res) => {
  res.send("API is running...");
});

describe("GET /", () => {
  it("should return API running text", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API is running...");
  });
});
