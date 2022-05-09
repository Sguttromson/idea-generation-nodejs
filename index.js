const express = require('express');
const morgan = require('morgan');
const { Prohairesis } = require('prohairesis');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 8081;

const mySQLString = 'mysql://bb85759ef4840a:863ef4ec@us-cdbr-east-05.cleardb.net/heroku_28c2b9b4021c247?reconnect=true';
const database = new Prohairesis(mySQLString);


app
    .use(morgan('dev'))
    .use(express.static('public'))

    .use(bodyParser.urlencoded({extended: false }))
    .use(bodyParser.json())
    
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