const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, pseudo, password } = req.body;
    if (!name || !pseudo || !password) {
        return res.status(400).json('incorrect form submition');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({ hash: hash, pseudo: pseudo })
            .into('login')
            .returning('pseudo')
            .then(loginPseudo => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        pseudo: loginPseudo[0],
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    });
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch(err => res.status(400).json('unable to register'));
};

module.exports = {
    handleRegister: handleRegister
};
