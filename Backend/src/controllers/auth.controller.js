const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");


/**
 * @name registerUserController
 * @description Register a new user, expects usrname, email and password required
 * @access Public
 * */

async function registerUserController(req,res) {
    
    const {username, email, password} = req.body
    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new userModel({
        username,
        email,
        password: hashedPassword
    })
    await newUser.save();
    const token = jwt.sign(
        {
            id: newUser._id, email: newUser.email,username: newUser.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )
    res.cookie("token", token)
    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            email: newUser.email,
            username: newUser.username
        },

        
    })
}

/**
 * @name LoginUserController
 * @description Login a user, expects usrname, email and password required
 * @access Public
 * */

async function LoginUserController(req,res) {
    const {username, email, password} = req.body
    if((!username && !email) || !password){
        return res.status(400).json({
            message: "Please provide an email/username and password"
        })
    }
    // Check whether user exists or not..
    const user = await userModel.findOne({
        $or: [{username}, {email}]
    })
    if(!user){
        return res.status(400).json({
            message: "User not found"
        })
    }
    // if exists then check passowrd..
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid password or email"
        })
    }
    const token = jwt.sign(
        {
            id: user._id, email: user.email,username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )
    res.cookie("token", token)
    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            email: user.email,
            username: user.username
        },

        
    })
}

/**
 * @name LogoutUserController
 * @description clear cookie from user cookie and add the token in blacklist
 * @access Public
 * */

async function LogoutUserController(req,res) {
    const token = req.cookies.token;

    if(token){
        await tokenBlacklistModel.create({token})
        res.clearCookie("token")
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }
} 

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access Private
 * */

async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
    
    res.status(200).json({
        message : "User details fetched successfully",
        user: {
            id: user._id,
            email: user.email,
            username: user.username
        }
    })
}

module.exports = {
    registerUserController, 
    LoginUserController,
    LogoutUserController,
    getMeController
}