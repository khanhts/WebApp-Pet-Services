var express = require('express');
var router = express.Router();
var userController = require('../controllers/users')
let { CreateSuccessRes, CreateErrorRes } = require('../utils/responseHandler');
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let {check_authentication} = require('../utils/check_auth')
let {validate,validatorLogin} = require('../utils/validators')

/* GET home page. */
router.post('/login', async function (req, res, next) {
    try {
        let body = req.body;
        let username = body.username;
        let password = body.password;
        let userID = await userController.CheckLogin(username, password);
        CreateSuccessRes(res, jwt.sign({
            id:userID,
            expire:(new Date(Date.now()+60*60*1000)).getTime()
        },constants.SECRET_KEY), 200)
    } catch (error) {
        next(error)
    }
});

router.post('/signup',validatorLogin,validate, async function (req, res, next) {
    try {
        let body = req.body;
        let newUser = await userController.CreateAnUser(
            body.username,body.password,body.email,'user'
        )
        CreateSuccessRes(res,jwt.sign({
            id:newUser._id,
            expire:(new Date(Date.now()+60*60*1000)).getTime()
        },constants.SECRET_KEY),200);
    } catch (error) {
        next(error)
    }
})
router.post('/changepassword',check_authentication, async function (req, res, next) {
    try {
        let body = req.body;
        let oldpassword = body.oldpassword;
        let newpassword = body.newpassword;
        let result = await userController.ChangePassword(req.user,oldpassword,newpassword);
        CreateSuccessRes(res,result,200);
    } catch (error) {
        next(error)
    }
    
})

router.get('/me',check_authentication, async function (req, res, next) {
    console.log(req.user);
    CreateSuccessRes(res,req.user,200)
})


//67de10517282904fbca502ae
module.exports = router;
