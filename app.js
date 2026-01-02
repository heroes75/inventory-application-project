require('dotenv').config()
const express = require('express');
const path = require('node:path');
const indexRouter = require('./routes/index-router');
const categoriesRouter = require('./routes/categories-router');
const celebritiesRouter = require('./routes/celebrities-router');
const { error } = require('node:console');

const app = express()
const PORT = 3000

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(indexRouter)
app.use(['/categories', '/category'], categoriesRouter)
app.use(['/celebrities', '/celebrity'], celebritiesRouter)

app.use((err, req, res, next) => {
    console.error('err:', err);
    res.status(err.statusCode || 500).render('noFound', {message: err.message})
})

app.listen(PORT, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`listen at port ${PORT}`)
})