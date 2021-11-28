const express = require('express')
const router = express.Router()

const skin = require('./skins.controller')
const champs = require('./champs.controller')

router.get('/', (req, res) => {

    res.render('index', {
        name: 'Ngo Le Quoc Dung',
        age: 20
    })
})

// router.get('/skins', skin.getSkins)


router.get('/skins', (_, res) => res.render('skins'))
router.get('/skins/:champName', skin.getSkins)
// All request come to POST
router.post('/skins', skin.postSkin)

router.get('/champions', (_, res) => res.render('champs'))
router.post('/champions', champs.postChamp)



module.exports = router