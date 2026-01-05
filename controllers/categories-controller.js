const { body, matchedData, validationResult } = require("express-validator");
const { categories, celebrities, maxIndex } = require("./index-controller");
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
        .isLength({ max: 3 })
        .withMessage("your message can't overflow "),
];

async function getAllCategories(req, res) {
    const categories = await queryAllCategories();
    console.log("categories:", categories);
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
    console.log("errors:", errors);
    if (errors.errors.length !== 0) {
        res.render("createCategory", { errors: errors.errors });
        return;
    }
    const { category } = matchedData(req);
    maxIndex.categoryIndex += 1;
    categories.push({
        id: maxIndex.categoryIndex,
        name: category,
    });
    await queryCreateCategory(category);
    console.log(categories);
    res.redirect("/category");
}

async function displayUpdateCategory(req, res) {
    const { id } = req.params;
    const category = await selectCategory(+id);
    console.log("category:", category);
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
    console.log("category:", category);
    for (const categoryId of categories) {
        if (categoryId.id === +id) {
            categoryId.name = category;
        }
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
    for (let i = 0; i < celebrities.length; i++) {
        if (celebrities[i].categoryId === +id) {
            celebrities.splice(i, 1);
            i--;
        }
    }
    categories.splice(selectedId, 1);
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
