const router = require('express').Router();
const { police_check } = require('../../middlewares');
const invoiceController = require('./controller');

router.get('/invoices/:order_id', invoiceController.show);
router.get('/invoices',
    police_check('view', 'Invoice'),
    invoiceController.index
);

module.exports = router;