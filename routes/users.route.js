const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const Task = require('../models/tasks.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


// create jwt
const createToken = (id, username) => {
  return jwt.sign({ id, username }, 'tresorapp');
}

// add user
router.post('/signup', async (req, res) => {
  try {
    let { email, username, password } = req.body;
    let tasks = '';
    let description = '';
    let start_date = '';
    let end_date = '';
    const hashedPwd = await bcrypt.hash(password.toString(), 10);
    if (hashedPwd) {
      password = hashedPwd;
      const user = new User({
        email,
        username,
        password
      });

      await user.save();
      let task = new Task({
        username,
        tasks,
        description,
        start_date,
        end_date
      });
      await task.save();
      if (task) {
        let token = createToken(user._id, user.username);
        res.cookie('jwt', token);
        res.json({ message: "user created" });
      }
    }
  } catch (err) {
    console.log(err.message, err.code);
    res.status(500).json({ error: `error creating user: ${err.message}`, code: 11000 });
  }
});

// get user from db
const auth = async (req, res, next) => {
  let currentUser;
  try {
    let { email, password } = req.body;
    currentUser = await User.findOne({ email });
    if (currentUser) {
      let comparedPwd = await bcrypt.compare(password, currentUser.password);
      if (comparedPwd) {
        let token = createToken(currentUser._id, currentUser.username);
        res.cookie('jwt', token);
        return res.status(200).json({ userID: currentUser._id });
      }
      return res.status(401).json({ message: " invalid password" });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (err) {
    res.status(500).json({ error: `error getting user: ${err.message}` });
  }
  res.user = currentUser;
  next();
};

router.post('/login', auth, async (req, res) => {
  res.json({ message: "Login successful" });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



module.exports = router;