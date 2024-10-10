const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Por favor ingresa un correo y contraseña'
            })
        }

        db.query('SELECT * FROM Usuarios WHERE email = ?', [email], async (error, results) => {
            console.log(results);

            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'El email o la contraseña son incorrectos'
                })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, proceed.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("El token es: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }
        })

    } catch (error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM Usuarios WHERE email = ?', [email], async (error, results) => {

        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'El correo ya está registrado'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Las contraseñas no coinciden'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO Usuarios SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {

            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'Usuario registrado'
                });
            }

        })

    });

}

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            //1) Verifica el token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            );

            console.log(decoded);
            //2) Revisa si el usuario aun existe

            db.query('SELECT * FROM Usuarios WHERE Id = ?', [decoded.id], (error, result) => {

                console.log(result);

                if (!result) {
                    return next();
                }

                req.user = result[0];
                console.log("el usuario es")
                console.log(req.user);
                return next();
            });

        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
}

exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.statur(200.redirect('/'));
}