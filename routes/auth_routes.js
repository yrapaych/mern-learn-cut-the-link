const {Router} = require('express')
const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = Router()

// /api/auth/register - this like the other
router.post('/register', 
[
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Minimal length is 6 symbols').isLength({min:6})
],
async (req, res)=> {
    try{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array(), message:'Incorrect data'})
        }
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if(candidate){
            return res.status(400).json({message:'This user is already registered'})
        }
        const hashedPass = await bcrypt.hash(password, 12)
        const user = new User({email, password:hashedPass})
        await user.save()

        res.status(201).json({message:'User is created'})

    }catch(e){
        res.status(500).json({message: 'Something has gone wrong'})
    }
})

router.post('/login', 
[
    check('email', 'Incorrect email').normalizeEmail().isEmail(),
    check('password', 'EnterPassword').exists()
],
async (req, res)=> {
    try{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array(), message:'Incorrect data'})
        }
        const {email, password} = req.body        
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User is not founded"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message:"Incorrect password"})
        }

        const token = jwt.sign(
            {userId:user.id},
            config.get('jwtSecret'),
            {expiresIn:'1h'}
        )
        res.json({token, userId:user.id})

    }catch(e){
        res.status(500).json({message: 'Something has gone wrong'})
    }
})


module.exports = router