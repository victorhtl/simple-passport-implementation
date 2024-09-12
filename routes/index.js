const router = require('express').Router();
const passport = require('passport');
const User = require('../config/database.js');
const bcrypt = require('bcrypt');
const isAuth = require('./authMiddlewares.js').isAuth;

// you don't need the stardand (req,res) callback here
router.post('/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: '/login-success'}));

 router.post('/register', async (req, res, next) => {
    if(!req.body.pw) return res.status(400).send('Password is missing <a href="/register">return</a> ');
    if(!req.body.uname) return res.status(400).send('Username is missing <a href="/register">return</a> ');
    const password_hash = await bcrypt.hash(req.body.pw, 10);

    const newUser = new User({
        username: req.body.uname,
        hash: password_hash
    })

    try {
        newUser.save()
        .then((user)=>console.log(user))
    } catch(err) {
        return res.sendStatus(500)
    }

    res.redirect('/login')
});


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1> <p><a href="/login">Login</a> or <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.status(400).send('You entered the wrong password. Try <a href=/login>again</a>');
});

module.exports = router;