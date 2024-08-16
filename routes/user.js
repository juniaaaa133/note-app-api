const express = require('express');
const { validateRegisterSchema, validateLoginSchema } = require('../validateSchema/validateSchemas');
const { login, register, checkProfile, checkToken, authorize, updateUser } = require('../controllers/userController');
const { checkSchema, body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

const route = express.Router();

route.post(
    '/login',
    checkSchema(validateLoginSchema),
    login
);
route.post(
    '/register',
    checkSchema(validateRegisterSchema),
    register
)
route.get('/check-token',authMiddleware,checkToken)
route.patch('/users/:id',authMiddleware,updateUser)
route.get('/users/:id',authMiddleware,checkProfile)
route.get('/token',authorize)

module.exports = route