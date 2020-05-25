require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
app.use(express.json());
app.use(cors());

// ======================================================
// DATA BASE SETUP
// ======================================================

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'Marine',
        password: '',
        database: 'smart-brain'
    }
});

// ======================================================
// ROUTES
// ======================================================

app.get('/', (req, res) => {
    res.send(db.users);
});

// REGISTER
app.post('/register', register.handleRegister(db, bcrypt));

// LOGIN
app.post('/signin', signin.handleSignin(db, bcrypt));

// PROFILE DETAILS
app.get('/profile/:id', profile.handleProfileGet(db));

// IMAGE ENTRIES
app.post('/imageurl', image.handleApiCall);
app.put('/image', image.handleImage(db));

// ======================================================

app.listen(process.env.PORT, () => {
    console.log('App is running on port', process.env.PORT);
});
