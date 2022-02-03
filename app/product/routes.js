const router = require('express').Router();
const { police_check } = require('../../middlewares');
const productController = require('./controller');
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/products');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

router.get('/products',
    productController.index
);
router.post('/products',
    multer({ storage: fileStorage, 
    fileFilter: fileFilter }).single('image'), 
    police_check('create', 'Product'),
    productController.store
);
router.put('/products/:id',
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'), 
    police_check('update', 'Product'),
    productController.update
);
router.delete('/products/:id',
    police_check('delete', 'Product'),
    productController.destroy
);

module.exports = router;