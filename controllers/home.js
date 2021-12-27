const handleDefaultEndPoint = (postgresDB) => (req, res) => {
	postgresDB
		.select('*')
		.from('users')
		.then((data) => {
			res.json(data);
		})
		.catch((error) => res.status(400).json(error));
};

export default handleDefaultEndPoint;
