const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("../utils/list_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("unique identifier is called 'id'", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect((res) => {
      console.log(res.body);

      res.body.forEach((blog, index) => {
        if (!blog.hasOwnProperty("id")) {
          throw new Error(`Expected object at index ${index} to have property 'id'`);
        }
      });
    });
});

test.only("its possible to create a new blog entry", async () => {

  let blog = {
    title: "React patternones",
    author: "Michael Chaqui Chan",
    url: "https://partrons.com/",
    likes: 14,
  }

  await api
  .post("/api/blogs")
  .send(blog) 
  .expect(201) 
  .expect("Content-Type", /application\/json/)
});


after(async () => {
  await mongoose.connection.close();
});
