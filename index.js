require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
// this is available at localhost:3001 -> http://localhost:3001/api/persons
// i dont need a db.json file with the same resource
// it was done like that: npm init -> created this index file -> added the array of data -> wrote app.get(desired path)
let persons = [
    {
        "my_id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "my_id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "my_id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "my_id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


//3.7, 3.8 
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body')
)


app.get('/', (req, res) => {
    res.send('<h1>a phonebook of sorts</h1>')
})

//3.2
/// =============== UPDATE THIS TOO
app.get('/info', (req, res) => {
    total = persons.length
    date = new Date()
    res.send(`<p>Phonebook has info for ${total} people</p> <p>${date}</p>`)
})


//3.1 -> 3.13 (w mongoose)
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

//3.3 -> 3.13 (w mongoose)
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
        .catch(err => next(err))
})

const genID = () => Math.floor(Math.random() * 1000000)

//3.5 + 3.6 -> 3.14 (w mongoose)
app.post('/api/persons', (req, res) => {
    const body = req.body
    //=================== UPDATE THIS FOR 3.17
    //If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL.
    //edited this out
    // const copy = persons.find(person => person.name === body.name)
    // if (copy) {
    //     return res.status(400).json({
    //         error: "name must be unique"
    //     })
    // }
    if (!body.name) {
        return res.status(400).json({
            error: "pls add a name"
        })
    }
    const person = new Person({
        my_id: genID(),
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

//3.4 -> 3.15
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


app.use((req, res) => {
    res.status(404)
    res.send('page not found')
})

//3.16
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})