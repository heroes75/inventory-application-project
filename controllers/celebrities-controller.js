const { validationResult, matchedData, body } = require("express-validator");
const { celebrities, categories, maxIndex } = require("./index-controller");
const CustomNotFoundError = require("./customNotFoundError");
const { queryAllCelebrity, queryAllCategories } = require("../db/queries");

const celebrityValidator = [
    body('name')
        .trim()
        .isAlpha().withMessage('name must only contain letters')
        .notEmpty().withMessage('name must not be empty')
        .isLength({max: 100}).withMessage('name must not overflow 100 characters'),
    body('birthdate')
        .trim()
        .notEmpty().withMessage('birthdate can\'t be empty')
        .isDate().withMessage('we don\'t know how you do this but birthdate must be to date format'),
    body('description')
        .trim()
        .notEmpty().withMessage('The bio must not be empty')
        .isLength({max: 500}),
    body('categoryId')
        .trim()
        .isInt().withMessage("But how you do this but your categoryID must be an INTEGER")
];
async function getAllCelebrities(req, res) {
  const celebrities = await queryAllCelebrity();
  console.log('celebrities:', celebrities)
  const categories = await queryAllCategories()
  console.log('categories:', categories)
  console.log('categories:', categories)
  res.render("allCelebrities", {
    celebrities: celebrities,
    categories: categories,
  });
}

function getCelebrity(req, res) {
  const { id } = req.params;
  const celebrity = celebrities.filter((celebrity) => celebrity.id === +id);
  if(celebrity.length === 0) {
    throw new CustomNotFoundError('celebrity not found');
  }
  const [{ name }] = categories.filter(
    (category) => category.id === celebrity[0]?.categoryId
  );
  res.render("celebrityPage", { celebrity: celebrity[0], category: name || '' });
}

function displayAddCelebrityForm(req, res) {
  res.render("addCelebrity", { categories: categories });
}

function addCelebrity(req, res) {
  const { name, birthdate, description, categoryId } = matchedData(req);
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('addCelebrity', {errors: errors.errors, categories: categories});
    return
  }
  maxIndex.celebrityIndex += 1;
  celebrities.push({
    name,
    birthdate,
    description,
    categoryId: +categoryId,
    id: maxIndex.celebrityIndex,
  });
  res.redirect("/celebrity");
}

function displayUpdateCelebrityForm(req, res) {
  const { id } = req.params;
  const [celebrity] = celebrities.filter((celebrity) => celebrity.id === +id);
  res.render("updateCelebrity", {
    categories: categories,
    celebrity: celebrity,
  });
}

function updateCelebrity(req, res) {
  const { id } = req.params;
  const { name, description, birthdate, categoryId } = req.body;
  for (let celebrity of celebrities) {
    if (celebrity.id === +id) {
      celebrity.name = name;
      celebrity.birthdate = birthdate;
      celebrity.description = description;
      celebrity.categoryId = +categoryId;
    }
  }
  res.redirect("/celebrity");
}

function deleteCelebrity(req, res) {
  const { id } = req.params;
  const selectedId = celebrities.findIndex((celebrity) => celebrity.id === +id);

  if (+id === 3) {
    res.render("unauthorized", { info: celebrities[selectedId].name });
    return;
  }
  if (selectedId === -1) {
    res.redirect("/celebrity");
    return;
  }
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
