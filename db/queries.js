const CustomDatabaseError = require("../controllers/customDatabaseErrors");
const pool = require("./pool");

async function queryAllCategories() {
    try {
        const { rows } = await pool.query("SELECT * FROM categories");
        return rows;
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function queryCelebritiesByCategoriesId(id) {
    
    try {
        const { rows } = await pool.query("SELECT * FROM celebrities WHERE categoryid=$1",[id]);
        return rows;
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function queryCreateCategory(category) {
    try {
        await pool.query("INSERT INTO categories (name) VALUES ($1)", [
            category,
        ]);
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function selectCategory(id) {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM categories WHERE id=$1",
            [id],
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function queryUpdateCategory(category, id) {
    try {
        await pool.query("UPDATE categories SET name=$1 WHERE id=$2", [
            category,
            id,
        ]);
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function queryDeleteCategory(id) {
    try {
        await pool.query("DELETE FROM categories WHERE id=$1", [id]);
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function queryAllCelebrity() {
    try {
        const { rows } = await pool.query("SELECT * FROM celebrities");
        return rows;
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function selectCelebrity(id) {
    try {
        const { rows } = await pool.query(
            `
            SELECT celebrities.id AS celebrityId, celebrities.name AS celebrityName, celebrities.birthdate, celebrities.description, categoryid, categories.name AS categoryName FROM celebrities
            JOIN categories ON (categoryid = categories.id)
            WHERE celebrities.id=$1
        `,
            [id],
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function deleteFromCelebrity(id) {
    try {
        await pool.query(`DELETE FROM celebrities WHERE id=$1`, [id]);
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function insertIntoCelebrities({
    name,
    description,
    birthdate,
    categoryId,
}) {
    try {
        await pool.query(
            `INSERT INTO celebrities (name, birthdate, description, categoryid) VALUES ($1, $2, $3, $4);`,
            [name, birthdate, description, categoryId],
        );
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

async function updateCelebritySet(
    { name, birthdate, description, categoryId },
    id,
) {
    try {
        await pool.query(
            "UPDATE celebrities SET name= $1, birthdate=$2, description=$3, categoryid=$4 WHERE id=$5",
            [name, birthdate, description, categoryId, id],
        );
    } catch (error) {
        console.error(error);
        throw new CustomDatabaseError("Server Error");
    }
}

module.exports = {
    queryAllCategories,
    queryCelebritiesByCategoriesId,
    queryCreateCategory,
    queryUpdateCategory,
    queryDeleteCategory,
    selectCategory,
    queryAllCelebrity,
    selectCelebrity,
    deleteFromCelebrity,
    insertIntoCelebrities,
    updateCelebritySet,
};
