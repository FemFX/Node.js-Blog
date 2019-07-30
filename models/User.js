const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSChema = new Schema({
    username: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        require: true
    }
})

userSChema.pre('save', function (next) {
    var user = this 

    if (!user.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})

userSChema.methods.comparePassword = function (clientPassword, cb) {
    bcrypt.compare(clientPassword, this.password, (err, isMatch) => {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}
module.exports = mongoose.model('User', userSChema)