const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Brand = require('./models/Brand');

const app = express();
const port = 3000;

// MongoDB connection local
// mongoose.connect('mongodb://localhost:27017/MONGO_CRUD_GUI', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Error connecting to MongoDB', err));


// MongoDB connection atlas cloud
mongoose.connect('mongodb+srv://Test1234:Test1234@cluster0.yws98.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // for serving static files (like CSS)

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Routes
// Home page - Show all brands and the form for adding a new brand
app.get('/', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.render('index', { brands });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

// Add new brand
app.post('/add', async (req, res) => {
    try {
        const newBrand = new Brand({
            name: req.body.name,
            description: req.body.description
        });
        await newBrand.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding brand');
    }
});

// Edit brand page - Prepopulate the form with the existing data
app.get('/edit/:id', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).send('Brand not found');
        res.render('edit', { brand });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

// Update brand
app.post('/edit/:id', async (req, res) => {
    try {
        await Brand.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating brand');
    }
});

// Delete brand
app.post('/delete/:id', async (req, res) => {
    try {
        await Brand.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting brand');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});