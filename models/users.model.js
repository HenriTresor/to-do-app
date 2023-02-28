const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required: [true, 'email is required'],
        lowercase: true,
        unique: [true, 'email is used']
    },
    username: {
        type:String,
        required: [true, 'username is required'],
        unique: [true, 'username must be unique']
    },
    password: {
        type:String,
        required: [true, 'password is required'],
        minLength: 6
    }

})

const User = mongoose.model('users', userSchema)

module.exports = User