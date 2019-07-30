const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/User')

module.exports = function (app) {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser((user, done) => { done(null, user.id) })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

    passport.use(new localStrategy(function (username, password, done) {
        User.findOne({ username }, (err, user) => {
            if (err) return done(err)
            if (!user) return done(null, false, { message: 'User not found'})

            user.comparePassword(password, (err, isMatch) => {
                if (err) return done(null, { message: 'Something went wrong'})
                if (!isMatch) return done(null, false,{ message: 'Invalid password'})
                return done(null, user)
            })
        })
    }))
}