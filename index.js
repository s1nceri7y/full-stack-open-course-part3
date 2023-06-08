const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
let morganConf = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :body ":referrer" ":user-agent"'
app.use(morgan(morganConf))

const peopleAPi = '/api/persons'

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

app.get(peopleAPi, (req, res) => {
    res.json(persons)
})

app.get(peopleAPi + '/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.put(peopleAPi + '/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    
    if (!person) {
        res.status(404).end()
    } else {
        persons = persons.map(p => p.id === id ? req.body : p)
    }
})


app.post(peopleAPi, (req, res) => {
    const newPerson = { id: Math.floor(Math.random() * 100000), ...req.body }
    if (!isValidNoteEntry(newPerson)) {
        res.status(400).send("invalid person object")
    } else if (persons.filter(p => p.name === newPerson.name).length > 0) {
        res.status(400).send("object is not unique")
    }
    
    persons = [...persons, newPerson]
    res.status(200).json(newPerson)
})


function isValidNoteEntry(person) {
    let isValid = person['name'] && person['number'] ? true : false
    console.log(person)
    console.log(`Result of validation is: ${isValid}`)
    return isValid
}

app.get('/info', (req, res) => {
    const size = `Phonebook has info for ${persons.length} people`
    const date = Date()
    res.send(`<div>
        <p>${size}</p>
        <p>${date}</p>
</div>`)
})

app.delete(peopleAPi + '/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(200).end()
})

app.use('/', express.static('build'))
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.use(cors)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})