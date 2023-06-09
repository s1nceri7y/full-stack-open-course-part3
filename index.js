require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const PersonApi = require('./routers/person')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
let morganConf = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :body ":referrer" ":user-agent"'
app.use(morgan(morganConf))

app.use(express.json())
app.use('/api/persons', PersonApi)
app.use('/', express.static('build'))

const unknownEndpoint = (request, response) => response.status(404).send({ error: 'unknown endpoint' })
app.use(unknownEndpoint)
const errorHandler = (error, req, res, next) => {
    console.log(error);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Mailformed id' })
    }

    next(error);
}

app.use(cors)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})