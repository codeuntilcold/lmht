const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {

    res.render('index', {
        name: 'Ngo Le Quoc Dung',
        age: 20
    })
})

module.exports = router