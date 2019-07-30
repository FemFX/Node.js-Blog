const express      = require('express');
const router       = express.Router();
const passport     = require('passport'); 
const {isLoggedIn, isOwnerPost} = require('../middleware');
const Post         = require('../models/Post'); 

router.get('/new', isLoggedIn, (req, res) => {
    res.render('newpost');
});
 
router.post('/new',isLoggedIn, async (req, res) => {
    const { title, image, body } = req.body
    try {
        await (new Post({
            title,
            image,
            body,
            userId : req.user._id
        }).save())

        return  res.redirect('/');
    } catch (err) {
        return res.render('newpost', { error : 'Something went wrong'});        
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("comments")
        return res.render('showpost', { post });
    } catch (err) {
        console.log(err);
        return  res.redirect('/');
        
    }
    
});

router.get('/:id/edit', isOwnerPost ,async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        return res.render('editpost', { post });
    } catch (err) {
        return  res.redirect('/');
    }
});

router.post('/:id/edit', isOwnerPost , async (req, res) => {
    const { title, image, body } = req.body
    try {
        const post = await Post.findById(req.params.id)
        post.title = title
        post.image = image
        post.body  = body
        await post.save()
        return  res.redirect(`/post/${req.params.id}`);
    } catch (err) {
        return  res.redirect('back');
    }
});
router.post('/:id/delete', isOwnerPost, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        await post.delete()
        return  res.redirect('/');
    } catch (err) {
        req.flash('error', 'You can\'t do it')
        return  res.redirect('back');
    }
});
router.post('/:id/comments', (req, res) => {

});

module.exports = router