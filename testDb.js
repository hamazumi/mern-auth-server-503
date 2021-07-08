require('dotenv').config()
const db = require('./models')
db.connect() // test the db connection

const dbTest = async () => {
    try {
        //create
        const newUser = new db.User({
            name: 'oliver cromwell',
            email: 'o@c.com',
            password: 'oliver'
        })

        await newUser.save()
        console.log('new user:', newUser)

        // read -- at login
        const foundUser = await db.User.findOne({
            name: 'oliver cromwell'
        })


        console.log('found user', foundUser)
    } catch(err) {
        console.log(err)
    }
}
dbTest()