require('dotenv').config() // to load environment variables from .env file
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const Blog = require('./models/blog')

const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const { checkForAuthenticationCookie } = require('./middlewares/authentication')

const app = express();
const PORT = process.env.PORT ||8000;

app.use(express.static(path.resolve('./public'))) // static files ko serve krne ke liye middleware;


mongoose.connect(process.env.MONGO_URL,)
.then((e) => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({ extended: false }))   // form data ko handle krne ke liye middleware
app.use(cookieParser())   // cookies ko handle krne ke liye middleware
app.use(checkForAuthenticationCookie('token')) // authentication middleware to check for cookies

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs: allBlogs
    })
})



app.use('/user', userRouter)
app.use('/blog', blogRouter)

// app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`))
module.exports = app; // export the app for testing purposes