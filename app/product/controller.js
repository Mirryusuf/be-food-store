const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');

const index = async (req, res, next) => {
    try {
        let { skip = 0, limit = 10, q = '', category = '', tags = [] } = req.query;

        let criteria = {};

        if(q.length){
            criteria = {
                ...criteria,
                name: {$regex: `${q}`, $options: 'i'}
            }
        }

        if(category.length){
            let categoryResult = await Category.findOne({name: {$regex: `${category}`, $options: 'i'}});
            if(categoryResult){
                criteria = {
                    ...criteria,
                    category: categoryResult._id
                }
            }
        }

        if(tags.length){
            let tagsResult = await Tag.find({name: {$in: tags}});
            if(tagsResult.length > 0){
                criteria = {
                    ...criteria,
                    tags: {$in: tagsResult.map(tag => tag._id)}
                }
            }
        }

        let count = await Product.find(criteria).countDocuments();

        let result = await Product.find(criteria).skip(parseInt(skip)).limit(parseInt(limit)).populate('category').populate('tags');
        res.send({
            data: result,
            count
        });
    } catch (err) {
        next(err);
    }
}

const store = async(req, res, next) => {
    try {
        let payload = req.body;
        const file = req.file;
        if(payload.category){
            const category = await Category.findOne({name: {$regex: payload.category, $options: 'i'}});
            if(category){
                payload ={...payload, category: category._id};
            } else {
                delete payload.category;
            }
        }

        if(payload.tags && payload.tags.length > 0){
            let tags =
            await Tag
            .find({name: {$in: payload.tags}});
            if(tags.length){
                payload = {...payload, tags: tags.map(tag => tag._id)};
            } else {
                delete payload.tags;
            }
        }

        if(!file){
            res.status(400).send({
                status: false,
                data: 'please upload a file image'
            });
        }
        const result = await Product.create({ ...payload, image_url:`${file.filename}` })
        res.send(result);
    } catch (err) {
        if(err && err.name === 'validationError'){
            return res.json({
                error: 1,
                message: err.name,
                fields: err.errors
            })
        }
        next(err);
    }
}

const update = async(req, res, next) => {
    try {
        let payload = req.body;
        const file = req.file;
        const { id } = req.params;
        if(!file){
            res.status(400).send({
                status: false,
                data: 'please upload a file image'
            });
        }
        let product = await Product.findById(id);
        let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
        if(fs.existsSync(currentImage)){
            fs.unlinkSync(currentImage);
        }
        const result = await Product.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        })
        res.send(result);
    } catch (err) {
        if(err && err.name === 'validationError'){
            return res.json({
                error: 1,
                message: err.name,
                fields: err.errors
            })
        }
        next(err);
    }
}

const destroy =  async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
        if(fs.existsSync(currentImage)){
            fs.unlinkSync(currentImage);
        }
        res.send(product);
    } catch (err) {
        if(err && err.name === 'validationError'){
            return res.json({
                error: 1,
                message: err.name,
                fields: err.errors
            })
        }
        next(err);
    }
}

module.exports = {
    store,
    update,
    index,
    destroy
}