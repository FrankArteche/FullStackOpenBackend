const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1
  });
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("blogs", {
    url: 1,
    title: 1,
    author: 1
  });
  response.json(user);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: "Username and password are required" });
  } else if (username.length < 3 || password.length < 3){
    return response.status(400).json({ error: "Username and password have to be at least 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.put("/:id", async (request, response) => {
  const { username, name } = request.body;



  let updatedUser = User.findByIdAndUpdate(request.params.id, request.body)

  response.status(201).end()
});

module.exports = usersRouter;
