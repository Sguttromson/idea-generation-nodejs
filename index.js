const express = require('express');
const morgan = require('morgan');
const { Prohairesis } = require('prohairesis');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

const mySQLString = process.env.CLEARDB_DATABASE_URL;
const database = new Prohairesis(mySQLString);


app
    .use(morgan('dev'))
    .use(express.static('public'))

    .use(bodyParser.urlencoded({extended: false }))
    .use(bodyParser.json())
    
    .get('/', async (req, res) => {
        const users = await database.query(`
        SELECT
            *
        FROM
            User
        ORDER BY
            date_added DESC
    `);

        res.contentType('html');

        res.end(`
        ${users.map((user) => {
            return `<p>${user.name} ${user.city} ${user.role} ${user.idea}</p>`;
        }).join('')}
    `);
    })

    .post('/api/user',  async (req, res) => {
        const body = req.body;
        await database.execute(`
        INSERT INTO User (
            name,
            city,
            role,
            idea,
            date_added
        ) VALUES (
            @name,
            @city,
            @role,
            @idea,
            NOW()
        )
        `, {
            name: body.name,
            city: body.city,
            role: body.role,
            idea: body.idea,

        });

    res.end('Thank You for your submission');
    })

    .listen(port, () => console.log(`Server listening on port ${port}`));