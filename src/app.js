const express = require('express')
const mysql = require('mysql');
const faker = require('faker');

const app = express()
const port = 3000;

const con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME
});


const create_customer = 'CREATE TABLE IF NOT EXISTS people(`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) not null,   PRIMARY KEY (`id`));'


con.connect(err => {
    if (err) throw err;
    console.log('Connected!');

    query(create_customer)
        .then(() => console.log('Table people created'))
        .catch(err => console.error(err))
});

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, result) => {
            if (err) return reject(err);
            return resolve(result)
        });
    })
}

const createCustomer = async () => {
    const insert = 'INSERT INTO people(name) VALUE(?)';
    return query(insert, [
        faker.name.findName()
    ]);
}

const getCustomers = async () => {

    const sql = 'SELECT id, name FROM people ORDER BY name';
    return query(sql);
}

app.get('/', async (req, res) => {

    try {

        await createCustomer();
        const customers = await getCustomers();

        const list = customers.map(c => `<li>${c.name}</li>`).join('')

        const template = `
        <h1>Full Cycle Rocks!</h1>
        <p>- Lista de nomes cadastrada no banco de dados.</p>
        <ul>
           ${list}
        </ul>`

        res.send(template);

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})