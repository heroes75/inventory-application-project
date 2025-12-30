const {Router} = require('express')
const { getAllCategories, getCelebritiesByCategoryId, displayFormCategory, createCategory, displayUpdateCategory, postUpdateCategory, deleteCategory } = require('../controllers/categories-controller')

const categoriesRouter = Router()

categoriesRouter.get('/', getAllCategories)
categoriesRouter.get('/create', displayFormCategory);
categoriesRouter.post('/create', createCategory);
categoriesRouter.get('/update/:id', displayUpdateCategory)
categoriesRouter.post('/update/:id', postUpdateCategory)
categoriesRouter.post('/delete/:id', deleteCategory)


categoriesRouter.get('/:id', getCelebritiesByCategoryId)


module.exports = categoriesRouter