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

const categoryValidator = [
    body("category")
        .trim()
        .notEmpty()
        .withMessage("category must not be empty")
        .isLength({ max: 30 })
        .withMessage("your message can't overflow 30 characters"),
];

async function getAllCategories(req, res) {
    const categories = await queryAllCategories();
    res.render("allCategories", { categories: categories });
}

async function getCelebritiesByCategoryId(req, res) {
    const { id } = req.params;
    const celebritiesByCategoryDatabase =
        await queryCelebritiesByCategoriesId(+id);
    res.render("celebrityByCategory", {
        celebrities: celebritiesByCategoryDatabase,
    });
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
    const categoryDb = await selectCategory(+id);
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
    if (+id === 1) {
        res.render("unauthorized", { info: categoryDatabase[selectedId].name });
        return;
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

module.exports = {
    getAllCategories,
    getCelebritiesByCategoryId,
    displayFormCategory,
    createCategory,
    displayUpdateCategory,
    postUpdateCategory,
    deleteCategory,
    categoryValidator,
};
