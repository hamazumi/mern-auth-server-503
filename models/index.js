// setting up the mongoose server
// require the mongoose package
const mongoose = require('mongoose')
// connection function
const connect = () => {
    const MONGODB_URI = process.env.MONGODB_URI
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    const db = mongoose.connection

    db.once('open', () => {
        console.log(`🔗 MONGODB Connected at ${db.host}: ${db.port}`)
    })
    db.on('err', (err) => {
        console.log('uh oh spaghetti')
        console.log(err)
    })
}

// export the onnection function and models

module.exports = {
    connect,
    User: mongoose.model('user', require('./User.js'))
}