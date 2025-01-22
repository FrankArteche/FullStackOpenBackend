const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, url, author, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "Title and URL are required" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
  });

  const savedBlog = await blog.save();
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
