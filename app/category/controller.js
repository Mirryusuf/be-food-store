const Categories = require('./model');

const index = async (req, res, next) => {
    try {
        const result = await Categories.find();
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

const store = async(req, res, next) => {
    try {
        const name = req.body;
        const result = await Categories.create(name)
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
        const { id } = req.params;
        const { name } = req.body;
        const result = await Categories.updateOne({ "_id" : id }, { $set: { "name" : name } })
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
        const result = await Categories.findByIdAndDelete(req.params.id);
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

module.exports = {
    store,
    update,
    index,
    destroy
}