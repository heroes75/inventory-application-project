const { validationResult, matchedData, body } = require("express-validator");
const { celebrities, categories, maxIndex } = require("./index-controller");
const CustomNotFoundError = require("./customNotFoundError");
const {
    queryAllCelebrity,
    queryAllCategories,
    selectCelebrity,
    insertIntoCelebrities,
    deleteFromCelebrity,
    updateCelebritySet,
} = require("../db/queries");

const celebrityValidator = [
    body("name")
        .trim()
        .not()
        .isNumeric()
        .withMessage("name is not a numeric value")
        // .isAlpha().withMessage('name must only contain letters')
        .notEmpty()
        .withMessage("name must not be empty")
        .isLength({ max: 100 })
        .withMessage("name must not overflow 100 characters"),
    body("birthdate")
        .trim()
        .notEmpty()
        .withMessage("birthdate can't be empty")
        .isDate()
        .withMessage(
            "we don't know how you do this but birthdate must be to date format",
        ),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("The bio must not be empty")
        .isLength({ max: 500 }),
    body("categoryId")
        .trim()
        .isInt()
        .withMessage(
            "But how you do this but your categoryID must be an INTEGER",
        ),
];
async function getAllCelebrities(req, res) {
    const celebrities = await queryAllCelebrity();
    const categories = await queryAllCategories();
    res.render("allCelebrities", {
        celebrities: celebrities,
        categories: categories,
    });
}

async function getCelebrity(req, res) {
    const { id } = req.params;
    const [
        {
            celebrityid,
            celebrityname,
            birthdate,
            description,
            categoryid,
            categoryname,
        },
    ] = await selectCelebrity(+id);
    res.render("celebrityPage", {
        celebrity: {
            id: celebrityid,
            name: celebrityname,
            description: description,
            birthdate,
            category: categoryname,
        },
    });
}

async function displayAddCelebrityForm(req, res) {
    const categories = await queryAllCategories();
    res.render("addCelebrity", { categories: categories });
}

async function addCelebrity(req, res) {
    const { name, birthdate, description, categoryId } = matchedData(req);
    // const { name, birthdate, description, categoryId } = req.body;
    console.log(
        "name, birthdate, description, categoryId:",
        name,
        birthdate,
        description,
        categoryId,
    );
    const errors = validationResult(req);
    const categories = await queryAllCategories();
    if (!errors.isEmpty()) {
        res.render("addCelebrity", {
            errors: errors.errors,
            categories: categories,
        });
        return;
    }
    maxIndex.celebrityIndex += 1;
    celebrities.push({
        name,
        birthdate,
        description,
        categoryId: +categoryId,
        id: maxIndex.celebrityIndex,
    });
    await insertIntoCelebrities({
        name,
        birthdate,
        description,
        categoryId: +categoryId,
    });
    res.redirect("/celebrity");
}

async function displayUpdateCelebrityForm(req, res) {
    const { id } = req.params;
    const [{ celebrityname, birthdate, description, categoryid, celebrityid }] =
        await selectCelebrity(+id);
    const categories = await queryAllCategories();
    res.render("updateCelebrity", {
        categories: categories,
        celebrity: {
            name: celebrityname,
            birthdate: birthdate.toISOString().split("T")[0],
            description,
            categoryId: categoryid,
            id: celebrityid,
        },
    });
}

async function updateCelebrity(req, res) {
    const { id } = req.params;
    const { name, description, birthdate, categoryId } = matchedData(req);
    console.log(
        "name, description, birthdate, categoryId:",
        name,
        description,
        birthdate,
        categoryId,
    );
    const errors = validationResult(req);
    console.log("errors:", errors);
    if (!errors.isEmpty()) {
        res.render("updateCelebrity", {
            categories: categories,
            celebrity: { name, birthdate, description, categoryId, id },
            errors: errors.errors,
        });
        return;
    }
    for (let celebrity of celebrities) {
        if (celebrity.id === +id) {
            celebrity.name = name;
            celebrity.birthdate = birthdate;
            celebrity.description = description;
            celebrity.categoryId = +categoryId;
        }
    }
    await updateCelebritySet(
        { name, description, birthdate, categoryId: +categoryId },
        +id,
    );
    res.redirect("/celebrity");
}

async function deleteCelebrity(req, res) {
    console.log("req.params:", req.params);
    const { id } = req.params;
    const selectedId = celebrities.findIndex(
        (celebrity) => celebrity.id === +id,
    );

    if (+id === 3) {
        res.render("unauthorized", { info: celebrities[selectedId].name });
        return;
    }

    await deleteFromCelebrity(+id);
    celebrities.splice(selectedId, 1);
    console.log("celebrities:", celebrities);
    res.redirect("/celebrity");
}

module.exports = {
    getAllCelebrities,
    getCelebrity,
    displayAddCelebrityForm,
    addCelebrity,
    displayUpdateCelebrityForm,
    updateCelebrity,
    deleteCelebrity,
    celebrityValidator,
};
