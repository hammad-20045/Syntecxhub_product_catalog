const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Product = require('./models/product');

// Database Connection
main().catch(err => console.log("DB Connection Error:", err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/productCatalog');
    console.log("Connected to MongoDB: productCatalog");
}

// Configurations
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware (ORDER MATTERS)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES

// 1. INDEX - (with optional Category Filter)
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const allProducts = await Product.find({ category });
        res.render('index', { allProducts, category });
    } else {
        const allProducts = await Product.find({});
        res.render('index', { allProducts, category: 'All' });
    }
});

// 2. NEW - Show form
app.get('/products/new', (req, res) => {
    res.render('new');
});

// 3. CREATE - Save to DB
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body.product);
    await newProduct.save();
    res.redirect(`/products`); // Redirect back to the main list after saving
});

// 4. SHOW - Details
app.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('show', { product });
});

// 5. EDIT - Show edit form
app.get('/products/:id/edit', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('edit', { product });
});

// 6. UPDATE - Save changes
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, { ...req.body.product }, { runValidators: true });
    res.redirect(`/products/${id}`);
});

// 7. DELETE - Remove product
app.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Product Catalog serving on port ${port}`);
});