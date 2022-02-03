const {Schema, model} = require('mongoose');

const deliveryAddressSchema = Schema({
    name: {
        type: String,
        required: [true, 'alamat harus di isi'],
        maxLength: [255, 'panjang maksimal nama 255 karakter']
    },
    kelurahan: {
        type: String,
        required: [true, 'kelurahan harus di isi'],
        maxLength: [255, 'panjang maksimal kelurahan 255 karakter']
    },
    kecamatan: {
        type: String,
        required: [true, 'kecamatan harus di isi'],
        maxLength: [255, 'panjang maksimal kecamatan 255 karakter']
    },
    kabupaten: {
        type: String,
        required: [true, 'kabupaten harus di isi'],
        maxLength: [255, 'panjang maksimal kabupaten 255 karakter']
    },
    provinsi: {
        type: String,
        required: [true, 'provinsi harus di isi'],
        maxLength: [255, 'panjang maksimal provinsi 255 karakter']
    },
    detail: {
        type: String,
        required: [true, 'detail harus di isi'],
        maxLength: [1000, 'panjang maksimal detail 1000 karakter']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = model('DeliveryAddress', deliveryAddressSchema)