const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const connection = require('./config/database');

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo');

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = MongoStore.create({
    mongoUrl: process.env.DB_STRING,
    collectionName: 'sessions',
    autoRemove: 'native',
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

app.listen(3000, ()=>console.log('Running'));