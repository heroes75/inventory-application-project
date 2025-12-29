const { Router } = require("express");
const { getAllCelebrities } = require("../controllers/celebrities-controller");

const itemsRouter = Router();

itemsRouter.get("/", getAllCelebrities);

module.exports = itemsRouter;
