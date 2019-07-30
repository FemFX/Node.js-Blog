const Post = require('../models/Post')

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.flash('error', 'You must be logged')
        res.redirect('/login')
    }
}

// check ownership
exports.isOwnerPost = async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            // find post by id
            const post = await Post.findById(req.params.id)

            if (!post) {
                // if not found the post
                req.flash('error', 'Post not found')
                return res.redirect('back')
            } else {
                // check ownership
                if (post.userId.equals(req.user._id)) {
                    // same ids
                    next()
                } else {
                    // not same ids
                    req.flash('error', "You don't have permission")
                    return res.redirect('back')
                }
            }
        } catch (err) {
            req.flash('error', 'Something went wrong')
            return res.redirect('back')
        }
    } else {
        req.flash('error', 'You must be logged in')
        res.redirect('back')
    }
}
