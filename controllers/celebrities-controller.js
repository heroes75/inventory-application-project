const {validationResult, matchedData, body} = require('express-validator')
const { celebrities, categories } = require("./index-controller");

function getAllCelebrities(req, res) {
  res.render("allCelebrities", {
    celebrities: celebrities,
    categories: categories,
  });
}

function getCelebrity(req, res) {
  const { id } = req.params;
  const celebrity = celebrities.filter((celebrity) => celebrity.id === +id);
  const [{ name }] = categories.filter(
    (category) => category.id === celebrity[0].categoryId
  );
  console.log("name:", name);
  res.render("celebrityPage", { celebrity: celebrity[0], category: name });
}

function displayAddCelebrityForm(req, res) {
  res.render("addCelebrity", { categories: categories });
}

function addCelebrity(req, res) {
  const { name, birthdate, description, categoryId } = req.body;
  celebrities.push({
    name,
    birthdate,
    description,
    categoryId: +categoryId,
    id: celebrities.length + 1,
  });
  res.redirect("/celebrity");
}

function displayUpdateCelebrityForm(req, res) {
  	const { id } = req.params;
	const [celebrity] = celebrities.filter(celebrity => celebrity.id === +id);
	res.render('updateCelebrity', {categories: categories, celebrity: celebrity})
}

function updateCelebrity(req, res) {
  	const { id } = req.params;
	const {name, description, birthdate, categoryId} = req.body;
	for (let celebrity of celebrities) {
		if (celebrity.id === +id) {
			celebrity.name = name;
			celebrity.birthdate = birthdate;
			celebrity.description = description;
			celebrity.categoryId = +categoryId;
		}
	}
	res.redirect('/celebrity')
}

function deleteCelebrity(req, res) {
  const {id} = req.params;
  const selectedId = celebrities.findIndex(celebrity => celebrity.id === +id)

  if (+id === 3) {
      res.render('unauthorized', {info: celebrities[selectedId].name});
      return
  }
  if(selectedId === -1) {
    res.redirect('/celebrity')
    return
  }
  celebrities.splice(selectedId, 1)
  console.log('celebrities:', celebrities)
  res.redirect('/celebrity')
}

module.exports = {
  getAllCelebrities,
  getCelebrity,
  displayAddCelebrityForm,
  addCelebrity,
  displayUpdateCelebrityForm,
  updateCelebrity,
  deleteCelebrity,
};
