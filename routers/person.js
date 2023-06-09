const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Person = require('../models/person')
const baseUri = ''

router.get(baseUri, (req, res, next) => {
    Person.find({}).then(result => res.json(result)).catch(err => next(err))
})

router.get(baseUri + '/:id', (req, res, next) => {
    const id = req.params.id

    Person.findById(id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(err => next(err))
})

router.put(baseUri + '/:id', (req, res, next) => {
    const id = req.params.id

    Person.findByIdAndUpdate(id, req.body).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(err => next(err))
})


router.post(baseUri, (req, res, next) => {
    const newPerson = new Person({ ...req.body })
    if (!isValidNoteEntry(newPerson)) {
        res.status(400).send("invalid person object")
    } else if (Person.find({ name: newPerson.name }).length > 0) {
        res.status(400).send("object is not unique")
    }

    newPerson.save()
        .then(result => { console.log(result); res.status(200).json(newPerson) })
        .catch(err => next(err))
})

router.delete(baseUri + '/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => res.status(200).end())
        .catch(err => next(err))
})

function isValidNoteEntry(person) {
    const isValid = person['name'] && person['number'] ? true : false
    console.log(`Result of validation ${person['name']} is: ${isValid}`)
    return isValid
}



module.exports = router