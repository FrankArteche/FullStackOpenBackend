const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("../utils/list_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
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
          throw new Error(
            `Expected object at index ${index} to have property 'id'`
          );
        }
      });
    });
});

test("its possible to create a new blog entry", async () => {
  let blog = {
    title: "React patternones",
    author: "Michael Chaqui Chan",
    url: "https://partrons.com/",
    likes: 14,
  };
  const blogsAtStart = await helper.blogsInDb();

  await api
    .post("/api/blogs")
    .send(blog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

  const contents = blogsAtEnd.map((n) => n.title);
  assert(contents.includes("React patternones"));
});

test("when likes is missing, default to 0", async () => {
  let blog = {
    title: "PASTRAMI",
    author: "Chaquichieras Chancho",
    url: "https://patreon.com/",
  };

  let response = await api
    .post("/api/blogs")
    .send(blog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("when title is missing, SEND 400", async () => {
  let blog = {
    author: "Chaquichieras Chancho",
    url: "https://patreon.com/",
    likes: 4,
  };

  let response = await api
    .post("/api/blogs")
    .send(blog)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.statusCode, 400);
});

test("when url is missing, SEND 400", async () => {
  let blog = {
    title: "PASTRAMI",
    author: "Chaquichieras Chancho",
    likes: 4,
  };

  let response = await api
    .post("/api/blogs")
    .send(blog)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.statusCode, 400);
});

describe("deletion of a blog post", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map((r) => r.title);
    assert(!contents.includes(blogToDelete.title));
  })
  test.only("fails with status code 404 if id is not valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/6a421a851c78a676234d17f7`).expect(404);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

    const contents = blogsAtEnd.map((r) => r.title);
    assert(contents.includes(blogToDelete.title));
  });
});

describe("update of a blog post", () => {
  test.only("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();

    let blogToUpdate 

    blogToUpdate = {...blogsAtStart[0], likes: 56}

    let response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(204)

    assert.strictEqual(response.statusCode, 204);
  })
  test.only("fails with status code 404 if id is not valid", async () => {
    const blogsAtStart = await helper.blogsInDb();

    let blogToUpdate 

    blogToUpdate = {...blogsAtStart[0], likes: 56}

    let response = await api
      .put(`/api/blogs/6a422a851b54a676234d17h7`)
      .send(blogToUpdate)
      .expect(400)
      .expect("Content-Type", "text/plain; charset=utf-8");

    assert.strictEqual(response.statusCode, 400);
  })
});

after(async () => {
  await mongoose.connection.close();
});
