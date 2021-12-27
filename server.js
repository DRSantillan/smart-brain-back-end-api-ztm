import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import handleRegistration from './controllers/register';
import handleUserSignin from './controllers/signin';
import handleProfileID from './controllers/profile';
import { handleApiCall, handleImage } from './controllers/image';
import handleDefaultEndPoint from './controllers/home';

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
app.get('/', handleDefaultEndPoint(postgresDB));
// SignIn Endpoint
app.post('/signin', handleUserSignin(postgresDB, bcrypt));
// Register Endpoint
app.post('/register', handleRegistration(postgresDB, bcrypt));
// Profile Endpoint
app.get('/profile/:id', handleProfileID(postgresDB));
// Image count update Endpoint
app.put('/image', handleImage(postgresDB));
app.put('/imageurl', handleApiCall(req, res));

app.listen(8000, () => {
	console.log(`SmartBrain application is running on port ${apiPort}`);
});
