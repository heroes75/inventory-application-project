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

function displayUpdateCategory(req, res) {
    const {id} = req.params;
    const category = categories.filter(category => category.id === +id);
    res.render('updateCategory', {category: category.length === 0 ? undefined : category[0]})
}

function postUpdateCategory(req, res) {
    const {category} = req.body;
    const {id} = req.params;
    for (const categoryId of categories) {
        if (categoryId.id === +id) {
            categoryId.name = category
        }
    }
    res.redirect('/category')
}

function deleteCategory(req, res) {
    const {id} = req.params;
    categories.splice(+id - 1, 1)
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
}