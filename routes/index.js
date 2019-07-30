const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const Post     = require('../models/Post');
const passport = require('passport');
 
router.get('/', async (req, res) => {
    const posts = await Post.find({}).sort({ created: -1 }).exec()
    res.render('index', { posts });
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }) 
    try {
        if (user) {
            req.flash('error', 'Username was used') 
            return res.render('register', { error : 'Username was used' });
        }
        else {
            const newUser = new User({
                username,
                password
            })
            await newUser.save()
            req.flash('success', 'Please login with your account')
            return  res.redirect('/login');
        }
    }
    catch (err){
        req.flash('error', 'Something went wrong')
        return res.render('register', { error : 'Something went wrong' });
    }
    

});

router.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash    : true 
}));
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'Logged out')
    res.redirect('/');
});
module.exports = router; 