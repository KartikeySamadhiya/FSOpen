require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/info', (request, response) => {
  const count = persons.length
  const date = new Date()

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(   //findByIdAndUpdate returns the document as it was before the update took place.
    request.params.id,
    {name , number},
    { new: true, runValidators: true, context: 'query' }    //new: true forces Mongoose to return the newly updated document instead
  )     //By default, Mongoose schema validation rules (such as required: true or minlength: 8) automatically run when creating new documents with .save(), but are ignored during updates. Setting runValidators: true forces Mongoose to validate the incoming data against your personSchema rules
  .then(updatedPerson => {
    if(updatedPerson){
        response.json(updatedPerson)
    }else{
        response.status(400).end()
    }
  })
  .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(result =>{
        response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  /*if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }*/

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
  .then(savedPerson => {    //earlier we put checks here like body should have name, number
    response.json(savedPerson)//now we moved over checks in person.js(mongo)
  })                    //so we add person her, it goes there if invalid error 
  .catch(error => next(error)) //and this handles that error
})


const errorhandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){       //Handled Case: You recognize the specific error type
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)       //Unhandled Case: An unexpected crash occurs (e.g., database connection dropped)
}             //pass to Express Built-in Error Handler


app.use(errorhandler) //this has to be the last loaded middleware, otherwise it will not work 

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})