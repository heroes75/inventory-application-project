const {Router} = require('express')
const { getAllCategories, getCelebritiesByCategoryId, displayFormCategory, createCategory } = require('../controllers/categories-controller')

const categoriesRouter = Router()

categoriesRouter.get('/', getAllCategories)
categoriesRouter.get('/create', displayFormCategory);
categoriesRouter.post('/create', createCategory);


categoriesRouter.get('/:id', getCelebritiesByCategoryId)


module.exports = categoriesRouter