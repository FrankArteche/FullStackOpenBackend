const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("../utils/list_helper");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

test("users are not created if no username or password is given", async () => {
  let wrongUser = {
    username: "",
    user: "f",
    password: "",
  };

  let response = await api.post("/api/users").expect(400);

  assert.strictEqual(response.statusCode, 400);
});

test("user count doesnt modify when bad POST is sent", async () => {
  let wrongUser = {
    username: "",
    user: "f",
    password: "",
  };
  const usersAtStart = await helper.usersInDb();

  await api
    .post("/api/users")
    .send(wrongUser)
    .expect(400)

  const usersAtEnd = await helper.usersInDb();

  assert.strictEqual(usersAtStart.length, usersAtEnd.length);
});
