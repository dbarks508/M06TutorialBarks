const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { render } = require('ejs');

//connect to mongo db
const dbURI = 'mongodb+srv://dylanbarks:Cooliest7!@cluster0.zyumiwp.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware and static files

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));



// sandbox routes
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'new blog 2',
//         snippit: 'about my new blog',
//         body: 'more about my new blog'
//     });

//     blog.save()
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// });

// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// });

// app.get('/single-blog', (req, res) => {
//     Blog.findById('63328f111e6efc7af1161faf')
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// });


// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});


app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// blog routes
app.get('/blogs', (req, res) => {
    Blog.find()
    .then((result) => {
        res.render('index', { title: 'All Blogs', blogs: result })
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
    .then((result) => {
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then((result) => {
        res.render('details', { blog: result, title: 'Blog Details' })
    })
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({ redirect: '/blogs' });
    })
    .catch(err => {
        console.log(err);
    });
});


app.get('/blogs/create',(req, res) => {
    res.render('create', { title: 'Create a new blog' });
})

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});