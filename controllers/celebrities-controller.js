function getAllCelebrities(req, res) {
  res.render("allCelebrities", { items: "All items will be here" });
}

function getCelebrity(req, res) {
  const { id } = req.params;
}

module.exports = {
  getAllCelebrities,
};
