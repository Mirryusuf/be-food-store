const User = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {getToken} = require('../../utils');
const config = require('../config');
// const dotenv = require("dotenv");
// dotenv.config();


const register = async(req, res, next) => {
    try {
        const payload = req.body;
        let user = new User(payload);
        await user.save();
        return res.json(user);
    } catch (err) {
        if(err && err.name === 'validationError'){
            return res.json({
                error: 1,
                message: err.name,
                fields: err.error
            })
        }
        next(err);   
    }
}

const localStrategy = async (email, password, done) => {
    try {
        let user = await User.findOne({email}).select('-__v -createdAt -updatedAt -cart_items -token');
        if(!user){
            return done();
        } 
        if(bcrypt.compareSync(password, user.password)){
            ( {password, ...userWithoutPassword} = user.toJSON() );
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null)
    }
    done(); 
}

const login = async (req, res, next) => {
    passport.authenticate('local', async function(err, user){
        if(err){
            return next(err);
        } 
        
        if(!user){
            return res.json({error:1, message: 'email atau password incorrect'});
        } 

        let signed = jwt.sign(user, config.secretkey);

        await User.findByIdAndUpdate(user._id, {$push: {token: signed}});

        res.json({
            message: 'login successfuly',
            user,
            token: signed
        });
    })(req, res, next)
}

// const login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         let getData = await User.findOne({email}).select('-__v -createdAt -updatedAt -cart_items -token');
//         if(!getData){
//             res.json({
//                 message: 'email atau password salah'
//             });
//         }
//         const resultLogin = bcrypt.compareSync(password, getData.password);

//         if(!resultLogin){
//             res.json({
//                 message: 'email atau password salah'
//             });
//         }

//         let signed = jwt.sign({getData}, process.env.SECRET_KEY);

//         await User.findByIdAndUpdate(getData._id, {$push: {token: signed}});

//         res.json({
//             message: 'login successfuly',
//             data: getData,
//             token: signed
//         });


//     } catch (err) {
//         if(err && err.name === 'validationError'){
//             return res.json({
//                 error: 1,
//                 message: err.name,
//                 fields: err.errors
//             })
//         }
//         next(err);   
//     }
// }

const logout = async (req, res, next) => {
    let token = getToken(req);
    let user = await User.findOneAndUpdate({token: {$in: [token]}}, {$pull: {token: token}}, {userFindAndModify: false});

    if(!token || !user){
        res.json({
            error: 1,
            message: 'user not fpound!'
        });
    }

    return res.json({
        error: 0,
        message: 'Logout berhasil'
    });

}

const me = (req, res, next) => {
    if(!req.user){
        res.json({
            err: 1,
            message: `You're not login or token expired`
        })
    }
    res.json(req.user);
}

module.exports = {
    register,
    localStrategy,
    login,
    logout,
    me
}