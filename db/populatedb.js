const { Client } = require("pg");
const { argv } = require("node:process");

const SQL = `
    CREATE TABLE IF NOT EXISTS categories 
    (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(30)
    );

    CREATE TABLE IF NOT EXISTS celebrities
    (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(100),
        birthdate DATE,
        description TEXT,
        categoryID INTEGER REFERENCES categories (id)
    );

    INSERT INTO categories (name) VALUES ('politics'), ('Musics');
    INSERT INTO celebrities (name, birthdate, description, categoryId) VALUES 
    ('NAOI REI', '2004-02-03', 'she so beautiful', 2),
    ('Aeri Uchinaga', '2000-10-30', 'she so beautiful too', 2),
    ('KAKO D AKISHINO', '1994-12-29', 'princess of japan', 1),
    ('KIM JISOO', '1995-01-03', 'Singer', 2);
`;

async function main() {
    const client = new Client({
        connectionString: argv[2],
    });

    await client.connect();
    await client.query(SQL);
    await client.end();
}

main();
