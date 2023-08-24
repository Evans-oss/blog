require ('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const session = require('express-session');


const connectDB = require('./server/config/db');
const  { isActiveRoute } = require('./server/helpers/routeHelpers');
const app = express(); //creates the express app. 
const PORT = process.env.PORT || 3000; 

//connect to the database.
connectDB();

// middlewares
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: {maxAge:  new Date (Date.now() + (3600000))}


}))

app.use(express.static('public')); // folder storing static files.

//Templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});