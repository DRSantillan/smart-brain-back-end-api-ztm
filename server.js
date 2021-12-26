import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

const postgresDB = knex({
	client: 'pg',
	host: 'localhost',
	user: '',
	password: '',
	database: 'smart-brain',
});

console.log(postgresDB.select('*').from('users'));
const apiPort = '8000';

const app = express();
app.use(express.json());
app.use(cors());
const smartBrainDB = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'gaijincoach@hotmail.com',
			password: '123',
			entries: 0,
			joined: new Date(),
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: '123',
			entries: 0,
			joined: new Date(),
		},
	],
	login: [
		{
			id: '043',
			hash: '',
			email: 'gaijincoach@hotmail.com',
		},
	],
};
// Main Endpoint
app.get('/', (req, res) => {
	res.send(smartBrainDB.users);
});
// SignIn Endpoint
app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	if (
		email === smartBrainDB.users[0].email &&
		password === smartBrainDB.users[0].password
	) {
		res.json(smartBrainDB.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
});
// Regist Endpoint
app.post('/register', (req, res) => {
	const { email, password, name } = req.body;
	bcrypt.hash(password, null, null, (err, hash) => {
		console.log(hash);
	});
	smartBrainDB.users.push({
		id: '125',
		name,
		email,
		password,
		entries: 0,
		joined: new Date(),
	});

	res.json(smartBrainDB.users[smartBrainDB.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let userFound = false;
	smartBrainDB.users.forEach((user) => {
		if (user.id === id) {
			userFound = true;
			return res.json(user);
		}
	});
	if (!userFound) {
		res.status(400).json('no such user');
	}
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	let userFound = false;
	smartBrainDB.users.forEach((user) => {
		if (user.id === id) {
			userFound = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!userFound) {
		res.status(400).json('no such user');
	}
});

app.listen(8000, () => {
	console.log(`SmartBrain application is running on port ${apiPort}`);
});

// /signin > post
// /register > post
// /profile/:userid > get > user
// /image > put > user
