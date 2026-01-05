const { Router } = require("express");
const {
    getAllCategories,
    getCelebritiesByCategoryId,
    displayFormCategory,
    createCategory,
    displayUpdateCategory,
    postUpdateCategory,
    deleteCategory,
    categoryValidator,
} = require("../controllers/categories-controller");

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/create", displayFormCategory);
categoriesRouter.post("/create", categoryValidator, createCategory);
categoriesRouter.get("/update/:id", displayUpdateCategory);
categoriesRouter.post("/update/:id", categoryValidator, postUpdateCategory);
categoriesRouter.post("/delete/:id", deleteCategory);

categoriesRouter.get("/:id", getCelebritiesByCategoryId);

module.exports = categoriesRouter;
