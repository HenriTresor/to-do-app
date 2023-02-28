const express = require('express')
const router = express.Router()
const User = require('../models/users.model')
const Task = require('../models/tasks.model')
const jwt = require('jsonwebtoken')

// add task

router.post('/', async (req, res) => {
  try {
    let {
      username,
      task,
      description,
      start_date,
      end_date
    } = req.body

    let newTask = new Task({
      username,
      tasks:task,
      description,
      start_date,
      end_date
    })

    await newTask.save()
    
    let allTasks = await Task.find({ username })
    if (allTasks != "") {
      return res.status(200).json(allTasks)
    } else {
      return res.status(404).json({message:"No Tasks Found"})
    }
  } catch (err) {
    res.status(500).json({err:err.message})
  }
})

router.get('/', async (req, res) => {

  try {
    const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET)
    if (token) {
      let currentUser = await User.findOne({ username: token.username })
      if (currentUser) {
        let currentUserTasks = await Task.find({ username: currentUser.username });
        if (currentUserTasks != "") {
          return res.status(200).json(currentUserTasks)
        } else {
          return res.status(404).json({message:"No Tasks Found"})
        }
      }
      
    }
    res.status(404).render('notauth')
  } catch (err) {
    res.status(500).json({err:err.message})
  }
})

router.delete('/delete/:id', async (req, res) => {
  let taskToDelete = await Task.findOneAndDelete({ _id: req.params.id })
  res.status(200).json(taskToDelete)
})

module.exports = router