const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const parser = require('body-parser')
const morgan = require('morgan')
const routes = require('./routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const favicon = require('express-favicon')
const fs = require('fs')
const config = require('../config')

// port settings
let port = process.env.PORT || 3333

// web socket protocol on localhost on port 3333
server.listen(port, () => {
    console.log(`Listen to http://localhost:${port}`)
})

// Middleware
// Body Parser, Morgan, and Public Compiled folder
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(express.static('public'))
app.use(cors())
app.use(morgan('dev'))
app.use(parser.urlencoded({ extended: true}))
app.use(parser.json())
app.use(cookieParser())

// Render the index.html
app.get('/', (req, res) => { 
    res.sendFile('index.html') 
})

app.get('*', (req, res) => {
    res.redirect('/')
})

app.use('/api', routes) // when you add api routes in routes.js

// Web socket on connection 
io.on('connection', (socket) => {
    setTimeout(() => {
        fs.watch(__dirname + '/../', {recursive: true}, (e, o) => {
            if (e === 'rename' || e === 'change') {
                socket.emit('save')
            }
        })
    }, 1000)
})