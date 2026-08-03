const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const authRouter = Router();

/**
 * @route   POST /api/auth/register
 * @description Register a new user
 * @access  Public
 */

authRouter.post('/register', authController.registerUserController);


/**
 * @route   POST /api/auth/login
 * @description Login a user with email and password
 * @access  Public
 */


authRouter.post('/login', authController.loginUserController);

/* Logout through the blacklisting through the mongodb but best from the Radish beacuse they heve the high through put */

/**
 * @route   GET /api/auth/logout
 * @description Logout a user and blacklist the token
 * @access  Public
 */



authRouter.post('/logout', authController.logoutUserController);

/**
 * @route   GET /api/auth/get-me
 * @description Get the currently logged-in user's information
 * @access  private
 */



authRouter.get('/get-me', authMiddleware, authController.getMeController);




module.exports = authRouter;