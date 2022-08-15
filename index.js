const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', function (request, response) {
    return JSON.stringify(request.body)
})
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    },
    {
      name: "Martin Fowler",
      number: "+234 23-3345",
      id: 5
    }
  ]
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    response.send(`<div>
                    <p>Phonebook has info for ${persons.length} people</p>
                    <p>${new Date()}</p>
                   </div>`
                )
  })

  app.get('/api/persons/:id', (request, response) => {
    console.log('id',request.params.id);
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

  app.delete(`/api/persons/:id`, (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

  app.post(`/api/persons`, (request, response) => {
    const randomId = Math.floor(Math.random() * (10**5 - 1) + 1)
    console.log(randomId);
    const body = request.body
    if (!body.name  || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    console.log(body)
    const newPerson = {
        name: body.name,
        number: body.number,
        id: randomId,
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
  })

  const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })