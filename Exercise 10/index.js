require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
require('express-async-errors');

const app = express();
const port = process.env.PORT || 3000;

let planets = [
    {
        id: 1,
        name: "Earth",
    },
    {
        id: 2,
        name: "Mars",
    },
];

app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});