const { Router } = require("express");
const { getAllCelebrities, getCelebrity, displayAddCelebrityForm, addCelebrity, displayUpdateCelebrityForm, updateCelebrity, deleteCelebrity, celebrityValidator } = require("../controllers/celebrities-controller");

const celebritiesRouter = Router();

celebritiesRouter.get("/", getAllCelebrities);
celebritiesRouter.get("/create", displayAddCelebrityForm);
celebritiesRouter.post("/create", celebrityValidator, addCelebrity);
celebritiesRouter.get("/:id", getCelebrity);
celebritiesRouter.get("/:id/update", displayUpdateCelebrityForm);
celebritiesRouter.post("/:id/update", updateCelebrity);
celebritiesRouter.post("/:id/delete", deleteCelebrity);

module.exports = celebritiesRouter;
