const exphbs = require('express-handlebars')
const express = require('express')
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))

const PORT = process.env.PORT || 4000

const router = require('./controllers/router')
app.use('/', router)

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT)
})