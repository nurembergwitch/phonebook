const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

// this is available at localhost:3001 -> http://localhost:3001/api/persons
// i dont need a db.json file with the same resource
// it was done like that: npm init -> created this index file -> added the array of data -> wrote app.get(desired path)
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
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



//Content-Type header is automatically set as application/json
//3.1
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//3.2
app.get('/info', (req, res) => {
    total = persons.length
    date = new Date()
    res.send(`<p>Phonebook has info for ${total} people</p> <p>${date}</p>`)
})



//3.3
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }

})

const genID = () => Math.floor(Math.random() * 1000000)

//3.5 + 3.6
app.post('/api/persons', (req, res) => {
    const body = req.body
    const copy = persons.find(person => person.name === body.name)
    if (copy) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    else if (!body.name) {
        return res.status(400).json({
            error: "pls add a name"
        })
    }
    const person = {
        id: genID(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(person)
})

//3.4
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(`person with id ${id} was deleted`)
    res.status(204).end()
})


app.use((req, res) => {
    res.status(404)
    res.send('page not found')
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
// const PORT = 3001
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
//     console.log('sad violin noises')
// })

