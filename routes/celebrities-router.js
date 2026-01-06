const { Router } = require("express");
const {
    getAllCelebrities,
    getCelebrity,
    displayAddCelebrityForm,
    addCelebrity,
    displayUpdateCelebrityForm,
    updateCelebrity,
    deleteCelebrity,
    celebrityValidator,
    getDeleteCelebrityPage,
} = require("../controllers/celebrities-controller");
const { passwordValidator } = require("../controllers/categories-controller");

const celebritiesRouter = Router();

celebritiesRouter.get("/", getAllCelebrities);
celebritiesRouter.get("/create", displayAddCelebrityForm);
celebritiesRouter.post("/create", celebrityValidator, addCelebrity);
celebritiesRouter.get("/:id", getCelebrity);
celebritiesRouter.get("/:id/update", displayUpdateCelebrityForm);
celebritiesRouter.post("/:id/update", celebrityValidator, passwordValidator, updateCelebrity);
celebritiesRouter.get("/:id/delete", getDeleteCelebrityPage);
celebritiesRouter.post("/:id/delete", passwordValidator, deleteCelebrity);

module.exports = celebritiesRouter;
