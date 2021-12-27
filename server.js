import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

const postgresDB = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'ecomdean',
		password: '',
		database: 'smart-brain',
	},
});

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
// Register Endpoint
app.post('/register', (req, res) => {
	const { email, password, name } = req.body;
	postgresDB('users')
		.returning('*')
		.insert({
			email: email,
			name: name,
			joined: new Date(),
		})
		.then((user) => {
			res.json(user[0]);
		})
		.catch((error) => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	postgresDB
		.select('*')
		.from('users')
		.where({ id })
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('No User Found');
			}
		})
		.catch((error) => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	postgresDB('users')
		.where({ id })
		.increment('entries', 1)
		.returning('*')
		.then((entries) => res.json(entries[0]))
		.catch((error) => res.status(400).json('not updating'));
});

app.listen(8000, () => {
	console.log(`SmartBrain application is running on port ${apiPort}`);
});
