#! /usr/bin/env node

const Express = require('express');
const getHours = require('./libs/get-hours')

const app = Express();

app.get('/', async (req, res) => {
    let days = await getHours();
    let sunday = await getHours("sunday");
    let saturday = await getHours("saturday");
    
    res.jsonp({ days, sunday, saturday })
})

app.get('/sunday|holidays', async (req, res) => {
    const hours = await getHours("sunday");
    res.jsonp({ hours })
})

app.get('/saturday', async (req, res) => {
    const hours = await getHours("saturday");
    res.jsonp({ hours })
})

app.get('/every-day', async (req, res) => {
    const hours = await getHours();
    res.jsonp({ hours })
})

app.get('/today', async (req, res) => {
    const now = new Date();
    const today = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ][now.getDay() - 1]
    const hours = await getHours(today);

    res.jsonp({ hours })
})



app.listen(3000, () => {
    console.log('Listening at http://localhost:3000')
})
