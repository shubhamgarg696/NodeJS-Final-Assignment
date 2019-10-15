const LocalStrategy = require('passport-local').Strategy;
const server = require('../server').connection;
const bcrypt = require('bcryptjs');

//Load operator Model
const operator = require('../server').operator;

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({
            operatornameField: 'email'
        }, (email, password, done) => {
            //Match operator
            operator.findOne({
                    where: {
                        email: email
                    }
                })
                .then(operator => {


                    operator = operator.get({
                        plain: true
                    })

                    if (!operator) {
                        return done(null, false, {
                            message: 'That Email is not Registered'
                        });
                    }
                    //Match Password
                    bcrypt.compare(password, operator.Password, (err, iMatch) => {
                        if (err) throw err;

                        if (iMatch) {
                            return done(null, operator);
                        } else {
                            return done(null, false, {
                                message: 'Password incorrect'
                            });
                        }

                    })
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeoperator((operator, done) => {
        done(null, operator);
    });

    passport.deserializeoperator((id, done) => {
        operator.findOne({
            id: id
        }).then((operator) => {
            if (!operator) {
                return done(new Error("No such operator"))
            }
            return done(null, operator)
        }).catch((err) => {
            done(err)
        })
    });
}