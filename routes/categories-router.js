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
    passwordValidator,
    getDeleteCategoryPage,
} = require("../controllers/categories-controller");

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/create", displayFormCategory);
categoriesRouter.post("/create", categoryValidator, createCategory);
categoriesRouter.get("/:id", getCelebritiesByCategoryId);
categoriesRouter.get("/update/:id", displayUpdateCategory);
categoriesRouter.post("/update/:id", categoryValidator, passwordValidator, postUpdateCategory);
categoriesRouter.get("/delete/:id", getDeleteCategoryPage);
categoriesRouter.post("/delete/:id", passwordValidator, deleteCategory);


module.exports = categoriesRouter;
