const router = require("express").Router();
const User =  require('../Models/User');
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateTokens')
const {signUpBodyValidation, loginBodyValidation } = require('../utils/validationSchema')


// signup
router.post('/signup', async(req,res) => {
    try {
        const {error} = signUpBodyValidation(req.body)
          if(error)
          return res.status(400).json({error: true, message: error.details[0].message});
    const user = await User.findOne({ email: req.body.email});
      if(user)
      return res.status(400).json({error: true, message:"User with this email are exist"})    
      const salt = await bcrypt.genSalt(Number(process.env.SALT))
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      await new User({...req.body, password: hashPassword}).save();
      res.status(200).json({ error: false, message: "Account created sucessfully"})
} catch (error) {
        console.log(error);
        res.status(500).json({error: true, message: 'Internal Server Error'})
    }
});


// Login

router.post('/login', async(req,res) => {
    try {
        const {error} = loginBodyValidation(req.body)
          if(error)
          return res.status(400).json({error: true, message: error.details[0].message});
    const user = await User.findOne({ email: req.body.email});
      if(!user)
      return res.status(401).json({error: true, message:"Invalide Email or password"})    
      const verifiedPassword = await bcrypt.compare(
          req.body.password,
          user.password
      );
      if(!verifiedPassword)
      return res.status(401).json({error: true , message: "Invalid Email or Password"})
// generate access and refresh token
const {accessToken, refreshToken} = await generateTokens(user);
res.status(200).json({
    error: false, accessToken, refreshToken, message: 'logged in sucessfully'
});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: true, message: 'Internal Server Error'})
    }
});



module.exports = router