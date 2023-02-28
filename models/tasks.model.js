const mongoose = require('mongoose')

const tasksSchema = new mongoose.Schema({
    username: {
        type: String
    },
    tasks: {
        type:String
    },
    description: {
        type: String
    },
    start_date: {
        type:String
    },
    end_date: {
        type:String
    }
  
})

const Task = mongoose.model('tasks', tasksSchema)

module.exports = Task