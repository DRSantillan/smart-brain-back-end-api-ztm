import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import handleRegistration from './controllers/register.js';
import handleUserSignin from './controllers/signin.js';
import handleProfileID from './controllers/profile.js';
import { handleApiCall, handleImage } from './controllers/image.js';
import handleDefaultEndPoint from './controllers/home.js';

const postgresDB = knex({
	client: 'pg',
	connection: {
		connectionString:
			'postgres://qzrvdcryiukuaf:653b0358bfc86f18a3e2388983225fa6693bca8ea5c5e2c93b4b956bf91cc838@ec2-52-72-252-211.compute-1.amazonaws.com:5432/d17t0p6e4bod57',
		ssl: true,
	},
});

const apiPort = '8000';

const app = express();
app.use(express.json());
app.use(cors());

// Main Endpoint
app.get('/', handleDefaultEndPoint(postgresDB));
// SignIn Endpoint
app.post('/signin', handleUserSignin(postgresDB, bcrypt));
// Register Endpoint
app.post('/register', handleRegistration(postgresDB, bcrypt));
// Profile Endpoint
app.get('/profile/:id', handleProfileID(postgresDB));
// Image count update Endpoint
app.put('/image', handleImage(postgresDB));
app.post('/imageurl', (req, res) => {
	handleApiCall(req, res);
});

app.listen(process.env.PORT || 8000, () => {
	console.log(
		`SmartBrain application is running on port ${process.env.PORT}`
	);
});
