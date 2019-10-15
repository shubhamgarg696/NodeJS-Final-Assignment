const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/authentication')

// operator Model
const operatorDB = require('../server');

var {
    band
} = operatorDB
//Welcome Page
router.get('/', (req, res) => res.render('welcome'));

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    getBands(req.session.passport.operator.Email, data => {
        res.render('dashboard', {
            name: req.session.passport.operator.Name,
            data: data
        })
    })
});

function getBands(operatorname, callback) {
    band.findAll({
        where: {
            operatorEmail: operatorname
        }
    }).then(bands => {
        callback(bands.map(b => b.get({
            plain: true
        })))
    })
}
module.exports = router;