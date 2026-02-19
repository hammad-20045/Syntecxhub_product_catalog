const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Home', 'Food', 'Other'] // Professional validation
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;