require("dotenv").config();
const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/index-router");
const categoriesRouter = require("./routes/categories-router");
const celebritiesRouter = require("./routes/celebrities-router");

const app = express();
const PORT = 3000;
const assetsPath = path.join(__dirname, "public")

app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(indexRouter);
app.use("/category", categoriesRouter);
app.use(["/celebrities", "/celebrity"], celebritiesRouter);

app.use((err, req, res, next) => {
    console.error("err:", err);
    res.status(err.statusCode || 500).render("noFound", {
        message: err.message,
    });
});

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    }
    console.log(`listen at port ${PORT}`);
});
