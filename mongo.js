const mongoose = require('mongoose')

if (process.argv.length != 5) {
    console.log('invalid amount of arguments')
    process.exit(1)
}
const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const dbUrl = `mongodb+srv://hqxkt8bex:${password}@fullstackcluster.rdpfd3b.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(dbUrl)

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    phone: phone
})

person.save().then(() => {
    console.log(`saved ${name} ${phone}`)
    mongoose.connection.close()
})