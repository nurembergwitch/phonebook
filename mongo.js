const mongoose = require('mongoose')


const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

// const url =
//     `mongodb+srv://reggie:${password}@cluster0.qlginam.mongodb.net/phonebook?retryWrites=true&w=majority`

//const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//     name: personName,
//     number: personNumber,
// })

if (process.argv.length <= 3) {
    console.log('phonebook:');
    Person.find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
} else {
    person.save().then(result => {
        console.log(`added ${personName} ${personNumber} to the phonebook`)
        mongoose.connection.close()
    })
}



