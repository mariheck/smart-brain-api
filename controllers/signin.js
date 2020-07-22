const handleSignin = (db, bcrypt) => (req, res) => {
    const { pseudo, password } = req.body;
    if (!pseudo || !password) {
        return res.status(400).json('incorrect form submition');
    }
    db.select('pseudo', 'hash')
        .from('login')
        .where('pseudo', '=', pseudo)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db
                    .select('*')
                    .from('users')
                    .where('pseudo', '=', pseudo)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('unable to get user'));
            } else {
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));
};

module.exports = {
    handleSignin: handleSignin
};
