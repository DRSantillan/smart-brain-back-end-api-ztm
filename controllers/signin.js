const handleUserSignin = (postgresDB, bcrypt) => (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('incorrect from submission');
	}
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
};

export default handleUserSignin;
