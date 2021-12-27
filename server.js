import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import e from 'express';

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

// Main Endpoint
app.get('/', (req, res) => {
	postgresDB
		.select('*')
		.from('users')
		.then((data) => {
			res.json(data);
		})
		.catch((error) => res.status(400).json(error));
});
// SignIn Endpoint
app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	postgresDB
		.select('email', 'hash')
		.from('login')
		.where({ email })
		.then((data) => {
			const isValidLogin = bcrypt.compareSync(password, data[0].hash);
			if (isValidLogin) {
				return postgresDB
					.select('*')
					.from('users')
					.where({ email })
					.then((user) => res.json(user[0]))
					.catch((error) =>
						res.status(400).json('unable to get user')
					);
			} else {
				res.status(400).json('wrong credentials');
			}
		})
		.catch((error) => res.status(400).json('wrong credentials'));
});
// Register Endpoint
app.post('/register', (req, res) => {
	const { email, password, name } = req.body;
	const hash = bcrypt.hashSync(password);
	postgresDB
		.transaction((trx) => {
			trx.insert({
				hash: hash,
				email: email,
			})
				.into('login')
				.returning('email')
				.then((loginEmail) => {
					return trx('users')
						.returning('*')
						.insert({
							email: loginEmail[0],
							name: name,
							joined: new Date(),
						})
						.then((user) => {
							res.json(user[0]);
						});
				})
				.then(trx.commit)
				.catch(trx.rollback);
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
