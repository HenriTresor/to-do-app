const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Task = require('../models/tasks.model');
const User = require('../models/users.model');


router.get('/', (req, res) => {
    res.render('home');
});

const decodeJWT = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, 'tresorapp', (err, payload) => {
            if (err) console.log('error decoding jwt:', err.message);
            req.user = payload
            next()
            return; 
        })
    } else {
        res.clearCookie('jwt')
        res.status(404).render('notauth')
        return;
    }
}

router.get('/dashboard', decodeJWT, async (req, res) => {
    try {
        if (req.cookies.jwt) {
            return res.status(200).render('index', {user: req.user,tasks: res.locals.tasks});
        } else {
            res.render('notauth');
        }
    } catch (err) {
        console.log('error getting user:', err.message);
        next();
    }
});

router.get('/login', (req, res) => {
    if (req.cookies.jwt) {
        return res.status(304).redirect('/dashboard');
    }
    res.status(200).render('login');
});

router.get('/signup', async (req, res) => {
    res.status(200).render('signup');
});

router.get('/logout', (req, res) => {
    if (req.cookies.jwt) {
        res.clearCookie('jwt');
        return res.render('loggedout')
    }
    res.redirect('/login');
});

module.exports = router;