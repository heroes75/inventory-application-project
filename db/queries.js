const CustomDatabaseError = require("../controllers/customDatabaseErrors");
const pool = require("./pool");

async function queryAllCategories() {
    try {
        const { rows } = await pool.query("SELECT * FROM categories");
        return rows;
    } catch (error) {
        throw new CustomDatabaseError("Server Error")
    }
  
}

async function queryCelebritiesByCategoriesId(id) {
    try {
        const {rows} = await pool.query('SELECT * FROM celebrities WHERE categoryId = $1', [id])
        return rows
    } catch (error) {
        throw new CustomDatabaseError("Server Error")
    }
}

async function queryCreateCategory(category) {
    try {
        await pool.query('INSERT INTO categories (name) VALUES ($1)', [category])
    } catch (error) {
        throw new CustomDatabaseError("Server Error")
    }
}

async function selectCategory(id) {
    try {
        const {rows} = await pool.query('SELECT * FROM categories WHERE id=$1', [id])
        return rows
    } catch (error) {
        throw new CustomDatabaseError("Server Error")
    }
}

async function queryUpdateCategory( category, id ) {
    try {
        await pool.query('UPDATE categories SET name=$1 WHERE id=$2', [category, id])
    } catch (error) {
        throw new CustomDatabaseError("Server Error")
    }
}

async function queryDeleteCategory(id) {
    try {
        await pool.query('DELETE FROM categories WHERE id=$1', [id])
    } catch (error) {
        throw new CustomDatabaseError(error)
    }
}


async function queryAllCelebrity() {
  const { rows } = await pool.query("SELECT * FROM celebrities");
  return rows;
}



module.exports = {
    queryAllCategories,
    queryCelebritiesByCategoriesId,
    queryCreateCategory,
    queryUpdateCategory,
    queryDeleteCategory,
    selectCategory,
    queryAllCelebrity,
}

