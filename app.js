const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
require('dotenv').config()

// constants

const app = express();
const PORT = process.env.PORT || 4000


// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routers

const tasksRouter = require('./routes/tasks.route');
const usersRouter = require('./routes/users.route');
const indexRouter = require('./routes/index.route')



// connect to mongodb
const MONGO_STR = process.env.DB_STR || 'mongodb://127.0.0.1:27017/todo-app'

mongoose.connect(MONGO_STR, {})
  .then(() => console.log('connected to mongodb!'))
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT} after connecting to mongodb!`);
    })
  })
  .catch(err => console.log('error connecting to mongodb:', err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use('/', indexRouter)
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);


// routes 

app.all("/*", (req, res) => {
  res.status(404).render('error')
})

