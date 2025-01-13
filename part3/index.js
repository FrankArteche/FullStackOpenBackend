require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();
app.use(cors());
app.use(express.static("dist"));

app.use(express.json());

morgan.token("body", function getReqBody(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <br/>
      <p>${new Date()}</p>
      `);
  });
});

//GET ALL PERSONS
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//GET PERSON BY ID
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    content: body.content,
    important: body.important,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  Person.findOne({ name: body.name }) 
    .then((existingPerson) => {
      if (existingPerson) {
        Person.findByIdAndUpdate(
          existingPerson._id,
          { number: body.number },  
          { new: true, runValidators: true, context: 'query'}
        )
          .then((updatedPerson) => {
            response.json(updatedPerson);
          })
          .catch((error) => {
            console.error(error);
            next(error);
          });
      } else {
        // Save new person if not found
        newPerson
          .save()
          .then((savedPerson) => {
            response.json(savedPerson);
          })
          .catch((error) => {
            console.error(error);
            next(error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.log(error.name);
  

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if(error.name === "ValidationError"){
    return response.status(400).send({ error: "Validations error"})
  }

  next(error);
};

app.use(errorHandler);
