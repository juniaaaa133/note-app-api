const express = require('express')
const {checkSchema} = require('express-validator');
const { validateNotationSchema } = require('../validateSchema/validateSchemas');
const { getAllNotes, createNote, showNote, updateNote, deleteNote } = require('../controllers/notationController');
const authMiddleware = require('../middlewares/authMiddleware');

const route = express.Router();

route.get('/notations',getAllNotes)
route.get('/notations/:id',showNote)
route.post(
'/notations',
authMiddleware,
checkSchema(validateNotationSchema),
createNote
)
route.patch(
'/notations/:id',
authMiddleware,
checkSchema(validateNotationSchema),
updateNote
)
route.delete(
'/notations/:id',
authMiddleware,
deleteNote
)

module.exports = route;
