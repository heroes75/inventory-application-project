const { categories, celebrities } = require("./index-controller")

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
    const {category} = req.body
    categories.push({
        id: categories.length + 1,
        name: category,
    })
    res.redirect('/category')
}

module.exports = {
    getAllCategories,
    getCelebritiesByCategoryId,
    displayFormCategory,
    createCategory,
}