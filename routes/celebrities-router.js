const { Router } = require("express");
const { getAllCelebrities, getCelebrity, displayAddCelebrityForm, addCelebrity } = require("../controllers/celebrities-controller");

const celebritiesRouter = Router();

celebritiesRouter.get("/", getAllCelebrities);
celebritiesRouter.get("/create", displayAddCelebrityForm);
celebritiesRouter.post("/create", addCelebrity);
celebritiesRouter.get("/:id", getCelebrity);

module.exports = celebritiesRouter;
