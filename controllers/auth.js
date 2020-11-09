const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            }) 
        }
        
        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(password + " this is password") 
            if( !results || !(await bcrypt.compare(password, results[0].password)) || !(await bcrypt.compare)){
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            } else {
                const id = results[0].id;
                console.log("id " + id + " done");

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("the token is : " + token);

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
    } catch(error) {
        console.log(error);
    }
}

exports.register = async (req, res) => {
    try{
        console.log(req.body);

        const {name, email, password, passwordConfirm} = req.body;
        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if(error){
                console.log(error);
            }
            if(results.length > 0){
                return res.statusCode(401).render('register', {
                    message: 'That email is already in use'
                })
            } else if(password !== passwordConfirm){
                return res.statusCode(401).render('register', {
                    message: 'Passwords do not match'
            })} 
            else {
                let hashedPassword = await bcrypt.hash(password, 8);
                // console.log(hashedPassword);

                db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
                    if(error){
                        console.log(error);
                    } else {
                        console.log("results : " + results[0].id + " done");
                        return res.render('register', {
                            message: 'User registered'
                        });
                    }
                })
                res.status(200).redirect("/");  
            }
        });
    } catch(error) {
        console.log(error);
    }
}   

exports.push = async (req, res) => {
    try{ 
        var userCount = 0;
// var clientUsername = "hello";
        io.sockets.emit('userCount', {userCount: userCount});
        socket.on('disconnect', function(){
            userCount--;
            io.sockets.emit('userCount', {userCount: userCount});
            console.log('disconnect');
        })
        return userCount;
    } catch(error){
        console.log(error);
    }
}