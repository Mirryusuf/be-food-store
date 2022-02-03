const mongoose = require('mongoose');
const {model, Schema} = mongoose;

let productSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'panjang nama kategori minimal 3 karakter'],
        required: [true, 'nama kategori harus diisi']
    },
    description: {
        type: String,
        maxlength: [1000, 'maksimal 1000 karakter']
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    tags: {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }
}, { timestamps: true });

module.exports = model('Product', productSchema);