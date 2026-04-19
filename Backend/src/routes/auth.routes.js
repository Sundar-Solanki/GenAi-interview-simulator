const {Router} = require('express');
const  authController   = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = Router();

/**
 * @routes POST/api/auth/register
 * @description Register a new user
 * @access Public
 * */

authRouter.post("/register",authController.registerUserController)

/**
 * @routes POST/api/auth/login
 * @description Login a user with email and password
 * @access Public
 * */

authRouter.post("/login",authController.LoginUserController)

/**
 * @routes POST/api/auth/logout
 * @description clear cookie from user cookie and add the token in blacklist
 * @access Public
 * */

authRouter.get("/logout",authController.LogoutUserController)

/**
 * @routes GET/api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 * */

authRouter.get("/get-me",authMiddleware.authUser, authController.getMeController)

module.exports = authRouter

