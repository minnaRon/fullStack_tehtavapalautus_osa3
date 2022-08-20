const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
let personName = null
let personNumber = null
const databaseName = 'phonebook'

const url = 
    `mongodb+srv://minnaRon:${password}@cluster0.yvj28z8.mongodb.net/${databaseName}?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const getAll = () => {
    Person.find({}).then(result => {
        console.log('');
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

const createPerson = () => {
    personName = process.argv[3]
    personNumber = process.argv[4]
    const person = new Person({
        name: personName,
        number: personNumber,
    })
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    getAll()

} else if (process.argv.length === 5) {
    createPerson()

}
