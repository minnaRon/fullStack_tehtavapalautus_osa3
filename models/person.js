const mongoose = require('mongoose')

const url = process.env.MONGODB_URI


console.log('connecting to MongoDB')
mongoose.connect(url)
    .then(result => {
        console.log(('connected to MongoDB'))
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Name should be at least 3 characters long.'],//, \'{VALUE}\' is too short to be name.'],
        required: true
    },
    number: {
        type: String,
        minlength: [8, 'Phone number is too short, should be at least 8 characters.'],
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d{5,}$/.test(v)
            },
            message: props => `${props.value} is not valid phone number`
        },
        required: [true, 'User phone number required']
    }
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)
