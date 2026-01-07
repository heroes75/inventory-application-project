const { body, matchedData, validationResult } = require("express-validator");
const {
    queryAllCategories,
    queryCreateCategory,
    queryUpdateCategory,
    queryDeleteCategory,
    queryCelebritiesByCategoriesId,
    selectCategory,
    queryAllCelebrity,
    deleteFromCelebrity,
} = require("../db/queries");
const CustomNotFoundError = require("./customNotFoundError");

const categoryValidator = [
    body("category")
        .trim()
        .notEmpty()
        .withMessage("category must not be empty")
        .isLength({ max: 30 })
        .withMessage("your message can't overflow 30 characters"),
    ];

const passwordValidator = [
    body("password")
        .trim()
        .equals("the code").withMessage("Please Enter the code")
]

async function getAllCategories(req, res) {
    const categories = await queryAllCategories();
    res.render("allCategories", { categories: categories });
}

async function getCelebritiesByCategoryId(req, res) {
    console.log('start of getCelebritiesByCategoryId');
    const { id } = req.params;
    console.log('req.params:', req.params)
    console.log('id:', id)
    if (id === "style-celebrity-by-category.css") {
        return
    }
    const celebritiesByCategoryDatabase = await queryCelebritiesByCategoriesId(+id);
    console.log('celebritiesByCategoryDatabase:', celebritiesByCategoryDatabase)
    res.render("celebrityByCategory", {
        celebrities: celebritiesByCategoryDatabase
    });
    console.log('end of getCelebritiesByCategoryId');
}

function displayFormCategory(req, res) {
    res.render("createCategory.ejs");
}

async function createCategory(req, res) {
    const errors = validationResult(req);
    if (errors.errors.length !== 0) {
        res.render("createCategory", { errors: errors.errors });
        return;
    }
    const { category } = matchedData(req);
    await queryCreateCategory(category);
    res.redirect("/category");
}

async function displayUpdateCategory(req, res) {
    const { id } = req.params;
    const category = await selectCategory(+id);
    res.render("updateCategory", {
        category: category.length === 0 ? undefined : category[0],
    });
}

async function postUpdateCategory(req, res) {
    const { category } = matchedData(req);
    const errors = validationResult(req);
    const { id } = req.params;
    const [categoryDb] = await selectCategory(+id);
    console.log('categoryDb:', categoryDb)
    if (!errors.isEmpty()) {
        res.render("updateCategory", {
            errors: errors.errors,
            category: categoryDb,
        });
        return;
    }
    await queryUpdateCategory(category, +id);
    res.redirect("/category");
}

async function deleteCategory(req, res) {
    const { id } = req.params;
    const categoryDatabase = await queryAllCategories();
    const selectedId = categoryDatabase.findIndex(
        (category) => category.id === +id,
    );
    if (selectedId === -1) {
        throw new CustomNotFoundError("this celebrity don't exist yet")
    }
    if (+id === 1) {
        res.render("unauthorized", { info: categoryDatabase[selectedId].name });
        return;
    }
    const [category] = await selectCategory(+id)
    console.log('category:', category)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render("deleteCategoryPage", { category: category, errors: errors.errors})
        return
    }
    const celebrities = await queryAllCelebrity();
    for (const celebrity of celebrities) {
        if (celebrity.categoryid === +id) {
            await deleteFromCelebrity(celebrity.id);
        }
    }
    await queryDeleteCategory(+id);
    res.redirect("/category");
}

async function getDeleteCategoryPage(req, res) {
    const id = req.params?.id;
    const [category] = await selectCategory(id)
    if (!category?.id) {
        throw new CustomNotFoundError("this category don't exist")
    }
    

    res.render('deleteCategoryPage', {category})
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
    passwordValidator,
    getDeleteCategoryPage,
};
