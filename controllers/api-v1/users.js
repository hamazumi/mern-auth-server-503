const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute.js')

// GET /users -- test api endpoint
router.get('/', async (req,res) => {
    
    res.json({msg: 'hi, the user endpoint is ok 🆗'})
})

// POST /users/register -- CREATE NEW USER Aka registration
router.post('/register', async (req,res) => {
    try{
        //check if user exists already:
        const findUser = await db.User.findOne({
            email: req.body.email
        })

        // BASED OFF TESTCRYPTO:
        // if user is found, dont let them register
        if(findUser) return res.status(400).json({msg: 'user already exists in the db'})
        console.log(findUser)
        // hash the password from req.body
        const password = req.body.password
        const salt=12
        const hashedPassword = await bcrypt.hash(password, salt)

        // enter user into our db/ create our new user
        const newUser = await db.User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            favorites: []
        })
        await newUser.save()

        // create the jwt payload
        const payload ={
            name: newUser.name,
            email: newUser.email,
            favorites: newUser.favorites,
            id: newUser.id
        }

        // sign the jwt with our server secret message and send the response
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 60*60})

        res.json({ token })
    }catch(err) {
        console.log(err)
        res.status(500).json({msg: 'internal server error'})
    }
})

//POST /user/login -- validate login credentials
router.post('/login', async (req,res) =>{
    try{
        // try to find user in db from the req.body.email
        const findUser = await db.User.findOne({
            email: req.body.email 
        })

        const validationFailedMsg = 'Incorrect username or password 🤣'

        // if user found -- return immediately
        if(!findUser) return res.status(400).json({ msg: validationFailedMsg })
        
        // check the user's pw from the db against what is in the req.body
        const matchPassword = await bcrypt.compare(req.body.password, findUser.password)
        
        // if the pw doesnt match- return immediately
        if(!matchPassword) return res.status(400).json({ msg: validationFailedMsg })
        // create the jwt payload
        const payload = {
            name: findUser.name,
            email: findUser.email,
            id: findUser.id
        }

        // sign the jwt and send it back 
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 60*60})
        
        res.json({token})
    } catch(err){
        console.log(err)
        res.status(500).json({msg: 'internal server error'})
    }
})



//PUT /park -- to add favorite park into user favorites:
router.put('/park/:id/add', async (req,res) =>{
    try{
        // try to find user in db from the req.body.email
        const updateFavorites = await db.User.findOne({ email: req.body.email }) //front-end should be using currentUser state to get email
        

        // -----for loop, if favorites array contains title:------

        if(updateFavorites.favorites.includes({title: req.params.id}) == false){

            updateFavorites.favorites.push({title: req.params.id})
        }else{
            console.log("already in favorites")
        }

        await updateFavorites.save()
        res.send(updateFavorites)

    }catch(err) { 
        console.log(err)
        res.json({msg: "favorite already exists"})
    }
})

//PUT /park -- to delete favorite park into user favorites:
router.put('/park/:id/delete', async (req,res) =>{
    try{
        // try to find user in db from the req.body.email
        const updateFavorites = await db.User.findOne({ email: req.body.email }) //front-end should be using currentUser state to get email
        updateFavorites.favorites.forEach((fav, i) => {
            if(fav.title === req.params.id){
                // console.log(req.params.id)
                updateFavorites.favorites.splice(i ,1)
            }
        })
        await updateFavorites.save()
        res.send(updateFavorites)
    }catch(err) {
        console.log(err)
    }
})


// GET /auth-locked -- will redirect if a bad jwt is found (or if one is not found)
router.get('/auth-locked', authLockedRoute, (req, res) => {
    //do whatever with the user
    // console.log(res.locals.user.favorites)
    const myFavs = res.locals.user.favorites
    console.log(myFavs)
    // send private data back
    res.json({myFavs})
    

    // Show list of favorites 
    
})



module.exports = router