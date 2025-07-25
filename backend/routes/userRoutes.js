const express =require('express');
const router= express.Router();
const User= require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');



router.post('/register', async (req,res)=>{
  
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.send(`Full URL: ${fullUrl}`);

  const {username,password}=req.body;
  try{
    const existing = await User.findOne({username});
    if(existing){
      return res.status(400).json({message:"Username already exists"});
      console.log("")
    }

    const hashedPassword=await bcryptjs.hash(password,10);
    const newUser=new User({username,password:hashedPassword});
    await newUser.save();
    res.status(201).json({message:'user registered',user: newUser});

  }catch(error){
    res.status(500).json({error:error.message});
  }
});

router.get('/',async (req,res)=>{
  try {
    const users=await User.find().sort({joinedAt:-1});
    res.json(users);
  } catch (error) {
    res.status(500).json({error:err.message});
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ message: "Login successful", 
      user:{
        id:user._id,
        username:user.username,
      },
    token, });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports=router;