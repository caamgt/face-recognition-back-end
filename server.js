const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt-nodejs");
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
  client: 'pg',
  connection: {
  	// Esto se encuentra en la documenbtacion del heroku
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

// Realizar querys a la base de datos.
// Esto regresa una promesa, hay que utilizar ".then".
db.select('*').from('users').then(data => {
});


const app = express();
// bodyParser, necesario para enviar json files, como este login de ejemplo
// Como es un midleware
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.send('it is working!');
});

// Creamos le login
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)});

// Creamos el registro.

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

// perfil del usuario
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

const Port = process.env.PORT;
app.listen(Port || 3001, () => {
	console.log(`Server is runing in port ${Port}`);
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/