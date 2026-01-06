const { validationResult, matchedData, body } = require("express-validator");
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
    const [celebrity] = await selectCelebrity(+id);
    if(!celebrity?.celebrityid) {
        throw new CustomNotFoundError("Celebrity not found")
    }
    res.render("celebrityPage", {
        celebrity: {
            id: celebrity.celebrityid,
            name: celebrity.celebrityname,
            description: celebrity.description,
            birthdate: celebrity.birthdate,
            category: celebrity.categoryname,
        },
    });
}

async function displayAddCelebrityForm(req, res) {
    const categories = await queryAllCategories();
    res.render("addCelebrity", { categories: categories });
}

async function addCelebrity(req, res) {
    const { name, birthdate, description, categoryId } = matchedData(req);
    const errors = validationResult(req);
    const categories = await queryAllCategories();
    if (!errors.isEmpty()) {
        res.render("addCelebrity", {
            errors: errors.errors,
            categories: categories,
        });
        return;
    }
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
    const errors = validationResult(req);
    const categories = await queryAllCategories();
    if (!errors.isEmpty()) {
        res.render("updateCelebrity", {
            categories: categories,
            celebrity: { name, birthdate, description, categoryId, id },
            errors: errors.errors,
        });
        return;
    }
    await updateCelebritySet(
        { name, description, birthdate, categoryId: +categoryId },
        +id,
    );
    res.redirect("/celebrity");
}

async function deleteCelebrity(req, res) {
    const { id } = req.params;
    const [celebrity] = await selectCelebrity(+id);
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('deleteCelebrityPage', {errors: errors.errors, celebrity})
        return
    }
    if (+id === 3) {
        res.render("unauthorized", { info: celebrity.celebrityname });
        return;
    }

    await deleteFromCelebrity(+id);
    res.redirect("/celebrity");
}

async function getDeleteCelebrityPage(req, res) {
    const id = req.params?.id
    const [celebrity] = await selectCelebrity(id)
    console.log('celebrity:', celebrity)
    if (!celebrity?.celebrityid) {
        throw new CustomNotFoundError("not celebrity found")
    }
    res.render('deleteCelebrityPage', {celebrity})
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
    getDeleteCelebrityPage
};
