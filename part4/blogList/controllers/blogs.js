const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const existingUser = await User.findById(decodedToken.id)
  // const existingUser = await User.find({});
  // if (existingUser.length === 0) {
  //   return response
  //     .status(400)
  //     .json({ error: "No users available in the database" });
  // }

  // let randomIndex = Math.floor(Math.random() * existingUser.length);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: existingUser._id,
  });

  const savedBlog = await blog.save();

  if (!existingUser.blogs) {
    existingUser.blogs = []; // Ensure blogs array exists
  }
  existingUser.blogs = existingUser.blogs.concat(savedBlog._id);

  await existingUser.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    const id = request.params.id;

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    response.status(204).end();
  } catch (error) {
    response.status(404).json({ error: "Blog not found" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, url, author, likes } = request.body;

  const blog = {
    likes,
  };

  try {
    let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.status(204).json(updatedBlog);
  } catch (error) {
    response.send(400).end();
  }
});

module.exports = blogsRouter;
