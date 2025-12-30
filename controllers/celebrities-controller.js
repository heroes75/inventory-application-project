const { celebrities } = require("./index-controller");

function getAllCelebrities(req, res) {
  res.render("allCelebrities", { celebrities: celebrities });
}

function getCelebrity(req, res) {
  const { id } = req.params;
  const celebrity = celebrities.filter((celebrity) => celebrity.id === +id);
  res.render("celebrityPage", { celebrity: celebrity[0] });
}

function displayAddCelebrityForm(req, res) {
  res.render("addCelebrity");
}

function addCelebrity(req, res) {
    const {name, birthdate, description} = req.body;
    celebrities.push({name, birthdate, description})
    res.redirect('/celebrity')
}

module.exports = {
  getAllCelebrities,
  getCelebrity,
  displayAddCelebrityForm,
  addCelebrity,
};
