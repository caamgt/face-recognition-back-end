const handleSignin = (req, res, db, bcrypt) => {

	const {email, password} = req.body;
	if (!email || !password) {
		return res.status(400).json('envío incorrecto del formulario');
	}

	db.select('email', 'hash').from('login')
	// Obtenemos la respuesta: el correo y el hash(password).
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
				.where('email', '=', email)
				.then(user => {
					res.json(user[0]);
				})
				// Si tenemos problemas para obtener el usuario.
				.catch(err => res.status(400).json('unable to get user'));
			} else {
				res.status(400).json('Credenciales incorrectas');
			}
		})
		.catch(err => res.status(400).json('Credenciales incorrectas'))
}

module.exports = {
	handleSignin: handleSignin
}