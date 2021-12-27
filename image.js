import Clarifai from 'clarifai';
import { restart } from 'nodemon';
// Clarifai Data for accessing the API
const app = new Clarifai.App({
	apiKey: '889a201a71cd40498bbe4ff050e39308',
});
export const handleApiCall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {res.json(data)})
	.catch(error => res.status(400).json(error));
}

export const handleImage = (postgresDB) => (req, res) => {
	const { id } = req.body;
	postgresDB('users')
		.where({ id })
		.increment('entries', 1)
		.returning('*')
		.then((entries) => res.json(entries[0]))
		.catch((error) => res.status(400).json('not updating'));
};


