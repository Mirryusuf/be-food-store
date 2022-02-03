const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
    name: {
        type: String,
        minLength: [5, 'panjang nama makanan minimal 5 karakter'],
        required: [true, 'name harus di isi']
    },

    price:{
        type: Number,
        required: [true, 'harga harus di isi']
    },

    qty: {
        type: Number,
        required: [true, 'kuantitas harus di isi'],
        min: [1, 'kuantitas minimal 1']
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
});

module.exports = model('OrderItem', orderItemSchema);