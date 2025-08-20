const { Router } = require('express')
const User = require('../models/user')
const router = Router()

router.get('/signin', (req, res) => {
    return res.render('signin')
})
router.get('/signup', (req, res) => {
    return res.render('signup')
})


router.post('/signup', async (req, res) => {
    const { fullName, email, password }  = req.body
    await User.create ({
        fullName,
        email,
        password
    })
    return res.render('signin')
})
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(password, email);

        return res
            .cookie('token', token)
            .redirect('/'); // ✅ stop here

    } catch (err) {
        console.error(err); // debug log
        return res.status(401).render('signin', { error: "Incorrect Email or Password" }); // ✅ stop here
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})
    

module.exports = router;