const {body, matchedData, validationResult} = require("express-validator")
const { categories, celebrities } = require("./index-controller")

const categoryValidator = [
    body('category')
        .trim()
        .notEmpty().withMessage('category must not be empty')
        .isLength({max: 30}).withMessage('your message can\'t overflow ')
]

function getAllCategories(req, res) {
    res.render('allCategories', {categories: categories})
}

function getCelebritiesByCategoryId(req, res) {
    const {id} = req.params
    const celebritiesByCategory = celebrities.filter(celebrity => celebrity.categoryId === +id)
    res.render("celebrityByCategory", {celebrities: celebritiesByCategory})
}

function displayFormCategory(req, res) {
    res.render('createCategory.ejs')
}

function createCategory(req, res) {
    const errors = validationResult(req);
    console.log('errors:', errors)
    if (errors.errors.length !== 0) {
        res.render('createCategory', {errors: errors.errors})
        return
    }
    const {category} = matchedData(req)
    categories.push({
        id: categories.length + 1,
        name: category,
    })
    res.redirect('/category')
}

function displayUpdateCategory(req, res) {
    const {id} = req.params;
    const category = categories.filter(category => category.id === +id);
    res.render('updateCategory', {category: category.length === 0 ? undefined : category[0]})
}

function postUpdateCategory(req, res) {
    const {category} = matchedData(req);
    const errors = validationResult(req);
    const {id} = req.params;
    if(!errors.isEmpty()) {
        res.render('updateCategory', {errors: errors.errors, category: categories.find(category => category.id === +id)});
        return
    }
    console.log('category:', category)
    for (const categoryId of categories) {
        if (categoryId.id === +id) {
            categoryId.name = category;
        }
    }
    res.redirect('/category')
}

function deleteCategory(req, res) {
    const {id} = req.params;
    const selectedId = categories.findIndex(category => category.id === +id);
    if (+id === 2) {
        res.render('unauthorized', {info: categories[selectedId].name});
        return
    }
    
    for (let i = 0; i < celebrities.length; i++) {
        if (celebrities[i].categoryId === +id) {
            celebrities.splice(i, 1)
            i--;
        }
    }
    categories.splice(selectedId, 1);
    res.redirect('/category')
}

module.exports = {
    getAllCategories,
    getCelebritiesByCategoryId,
    displayFormCategory,
    createCategory,
    displayUpdateCategory,
    postUpdateCategory,
    deleteCategory,
    categoryValidator,
}