require ('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
// config express app
const app = express()
const PORT = process.env.PORT || 3001
const rowdyResults = rowdy.begin(app)

//connect to db
const db = require('./models')
db.connect()


//middlewares
app.use(cors())
//body parser middleware below used for parsing json requests
// need to use req.body:!!
app.use(express.json()) //for the request body
app.use(express.urlencoded({extended: false}))
// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))
// app.use('/api-v1/profile', require('./controllers/api-v1/profile.js'))

// custom middleware

// const middleWare = (req, res, next) => {
//     console.log('I am a route specific middlware')
//     next()
// }
// // only uses this on one route, use app.use((req,res,next)) to use for all routes
// app.get('/', middleWare, (req, res) => {
//     console.log(res.locals)
//     res.locals.anything = "🐟"
    
// })



//test route


//listen on a port
app.listen(PORT, () => {
    rowdyResults.print()
    console.log(`listening on port ${PORT} 🛶 🦘`)
})
