const handleRegistration = (postgresDB, bcrypt) => (req, res) => {
	const { email, password, name } = req.body;
	if (!email || !name || !password) {
		console.log('not data in form');
		return res.status(400).json('incorrect form submission');
	}
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
					console.log('inserting login email');
					return trx('users')
						.returning('*')
						.insert({
							email: loginEmail[0],
							name: name,
							joined: new Date(),
						})
						.then((user) => {
							console.log('returning registered user');
							res.json(user[0]);
						});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		})
		.catch((error) => {
			console.log(error, 'error for registreirng');
			res.status(400).json('unable to register');
		});
};

export default handleRegistration;
