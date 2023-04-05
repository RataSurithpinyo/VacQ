const User = require('../models/User');
exports.register= async(req,res,next)=>{
    try{
        const {name,email,password,role} = req.body;
        //create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });
        //create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);
    } catch(err){
        res.status(400).json({success:false});
        console.log(err.stack);
    }
};

exports.login=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({success:false,
        msg:'Please provide an email and password'});
    }
    //check for user
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.status(400).json({success:false,
        msg:'Invalid credentials'});
    }
    //check if password is matched
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return res.status(401).json({success:false,
        msg:'Invalid credentials'});
    }
    //create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({success:true,token});
    sendTokenResponse(user,200,res);
    }catch(err){
        return res.status(401).json({success:false, msg:'Cannot convert email or password to string'});
    }
};

//get token from model, create cookie and send response
const sendTokenResponse=(user,statusCode,res)=>{
    //create token
    const token = user.getSignedJwtToken();
    const options = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        //millisec
        httpOnly: true
    };
    if (process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    res.status(statusCode).json({ //.cookie('token',token,options)
        success:true,
        //add to frontend
        _id: user._id,
        name: user.name,
        email: user.email,
        token})
}

exports.getMe=async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true, data:user
    });
}

exports.logout=async(req,res,next)=>{
    res.cookie('token','none',{
        expires: new Date(Date.now()+10*1000), //this line
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        data:{}
    });
};
