const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./database');
const bcrypt = require('bcrypt');

const params = {
    usernameField: 'uname',
    passwordField: 'pw'
}

passport.use(new LocalStrategy(params, (username, password, done) => {
    User.findOne({username: username})
        .then(async (user)=>{

            // done(error, user)
            if(!user){return done(null, false)}

            // password decryption
            const isValid = await bcrypt.compare(password, user.hash)

            if(isValid){
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
        .catch(err => done(err))
}));

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser((userId, done)=>{
    // implement your db findByid
    User.findById(userId)
        .then((user)=>{
            done(null, user)
        })
        .catch(err => done(err))
})