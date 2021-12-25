import express from 'express';

const apiPort = '8000';

const app = express();
app.use(express.json());
const smartBrainDB = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
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
};

app.get('/', (req, res) => {
	res.send(smartBrainDB.users);
});

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	if (
		email === smartBrainDB.users[0].email &&
		password === smartBrainDB.users[0].password
	) {
		res.json('success');
	} else {
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const { email, password, name } = req.body;

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

app.post('/register', (req, res) => {
	res.json('registered');
});

app.listen(8000, () => {
	console.log(`app is running on port ${apiPort}`);
});

// /signin > post
// /register > post
// /profile/:userid > get > user
// /image > put > user
