const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { Router } = require('express');
const Blog = require('../models/blog'); 
const Comment = require('../models/comments'); // Assuming you have a Comment model defined

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve('./public/uploads/');

    // ensure folder exists (important!)
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // sanitize filename (avoid spaces and special chars)
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
  return res.render('addBlog', {
    user: req.user
  });
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy'); 
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy'); // Fetch comments for the blog
    console.log(blog)
    return res.render('blog', {
        user: req.user,
        blog,
        comments
    })         

})


 router.post('/comment/:blogId', async (req, res) => {
    const blogId = req.params.blogId;
    const comment = await Comment.create({
        content:    req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${blogId}`);     
})

router.post('/', upload.single('coverImage'), async (req, res) => {
    const  { title, body }  = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}` 
    })

//   console.log("body", req.body);
//   console.log("file", req.file);  // <-- should NOT be undefined anymore

  return res.redirect('/');
});

module.exports = router;
