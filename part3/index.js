require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const Person = require("./models/person");

const app = express();
app.use(cors())
app.use(express.static('dist'))

app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token('body', function getReqBody (req) {  
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <br/>
    <p>${new Date()}</p>
    `);
});

//GET ALL PERSONS
app.get("/api/persons", (request, response) => {
  Person.find({}).then((notes) => {
    response.json(notes);
  });
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//GET PERSON BY ID
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((person) => {    
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  })  
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const newID = Math.floor(Math.random() * 1000);
  return String(newID);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: "Something failed",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });

});


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

