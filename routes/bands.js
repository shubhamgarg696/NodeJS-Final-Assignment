const route = require('express').Router()
// operator Model
const operatorDB = require('../server');

var {
    band
} = operatorDB

route.get('/', function (req, res) {
    res.render('bands', {
        bands
    })
})

route.post('/create', function (req, res) {
    let name = req.body.name
    let desc = req.body.desc
    band.build({
        Title: name,
        Description: desc,
        operatorEmail: req.session.passport.operator.Email
    }).save().then((band) => {
        fetchBands(req, res)
    })
})

route.post('/update/:id', function (req, res) {
    let id = req.params.id
    let name = req.body.name
    let desc = req.body.desc
    band.update({
        Title: name,
        Description: desc,
    }, {
        where: {
            id: Number(id)
        }
    }).then((band) => {
        fetchBands(req, res)
    })
})

route.get('/delete/:id', function (req, res) {
    let id = req.params.id

    band.destroy({
        where: {
            id: Number(id)
        }
    }).then((band) => {
        fetchBands(req, res)
    })
})

function fetchBands(req, res) {
    getBands(req.session.passport.operator.Email, bands => {
        res.render('dashboard', {
            name: req.session.passport.operator.Name,
            data: bands
        })
    })
}

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


module.exports = route