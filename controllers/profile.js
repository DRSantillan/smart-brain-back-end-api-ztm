const handleProfileID = (postgresDB) => (req, res) => {
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
};

export default handleProfileID;
