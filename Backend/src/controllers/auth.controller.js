const usermodel = require('../models/user.model');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // json tokn kay liyay 
const tokenBlacklistModel = require('../models/blacklist.model');



function getJwtSecret() {
  return process.env.JWT_SECRET;
}

/**
 * @name registerUserController
 * @description Register a new user, expect username , email and password in the request body
 * @access  Public
 */



async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
    }

  const isUserAlreadyExists = await usermodel.findOne({ $or: [{ username }, { email }] });


  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "Username or email already exists" });
  }

  /* hashing the password before create the new user  */

  const hash=await bcrypt.hash(password, 10);

  const user = await usermodel.create({
    username,
    email,
    password: hash,
  });   

  /* after hashing create the  new user ,
     after that create the token and go to jwtsecretkey website and
      create the secret key and put it in .env file and then use it to generate the token

     
 */

     const jwtSecret = getJwtSecret();

     if (!jwtSecret) {
      return res.status(500).json({ message: "JWT secret is not configured" });
     }

     const token =jwt.sign({
      id: user._id, username: user.username,},
      jwtSecret, { expiresIn: '1d' }

     )



     /* and the tokken is set into the cookie */
     res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    });
     res.status(201).json({ message: "User registered successfully", 
      user: { id: user._id, username: user.username, email: user.email }
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Username or email already exists" });
      }

      res.status(500).json({ message: "Registration failed", error: error.message });
    }
      }

 /**
  * @name loginUserController
  * @description Login a user, expect email and password in the request body
  * @access  Public
  */
 
   async function loginUserController(req, res) {
    try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const jwtSecret = getJwtSecret();

    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1d' });
    res.cookie("token",token,{
      httpOnly:true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    })
    res.status(200).json({
      message: "User logged in successfully",
      user: { id: user._id, username: user.username, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }

   }


/**
 * 
 * @name logoutUserController
 * @description Logout a user and blacklist the token
 * @access  Public
 * 
 */

async function logoutUserController(req, res) {
  try {
    const token = req.cookies?.token;

    if (token) {
      try {
        await tokenBlacklistModel.findOneAndUpdate(
          { token },
          { $setOnInsert: { token } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (blacklistError) {
        console.warn('Token blacklist update failed during logout:', blacklistError.message);
      }
    }

    res.clearCookie('token', { httpOnly: true, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Logout failed:', error.message);
    return res.status(500).json({ message: 'Logout failed', error: error.message });
  }
}


/**
 * @name getMeController
 * @description Get the currently logged-in user's information
 * @access  Private

 */


async function getMeController(req, res) {
  const user = await usermodel.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ 
    user: { id: user._id, username: user.username, email: user.email }
  });
}



module.exports = { 
registerUserController,
loginUserController,
logoutUserController,getMeController
 };
