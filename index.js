require('dotenv').config()

const express = require('express')

//sallitaan kommunikointi, kun eri portit selain ja palvelin
//const cors = require('cors')

const morgan = require('morgan')

const app = express()

app.use(express.json())

app.use(express.static('build'))

//app.use(cors())

//app.use(morgan('tiny'))

morgan.token('body', function (request, response) {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/person')


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})


app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(`
                  <div>
                  <p>Phonebook has info for ${count} people</p>
                  <p>${new Date()}</p>
                  </div>
                  `)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})


app.delete(`/api/persons/:id`, (request, response, next) =>{
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
  })
  .catch(error => next(error))
})


app.post(`/api/persons`, (request, response, next) => {
  //const randomId = Math.floor(Math.random() * (10**5 - 1) + 1)
  const body = request.body
  if (!body.name  || !body.number) {
      return response.status(400).json({
          error: 'name or number missing'
      })
    }
  const person = new Person({
    name: body.name,
    number: body.number,
    // id: randomId,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})


app.put(`/api/persons/:id`, (request, response, next ) => {
  //const body = request.body
  const { name, number } = request.body
  /*
  const person = {
    name: body.name,
    number: body.number,
  }
  */
  Person.findByIdAndUpdate(
    request.params.id, 
    //person, {new: true})
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      next(error)
    })
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error:'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
