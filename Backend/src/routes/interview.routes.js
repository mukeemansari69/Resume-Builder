const express = require("express")
const { authMiddleware } = require("../middlewares/auth.middleware")
const interviewController=require("../controllers/interview.controller")
const upload=require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route Post /api/interview
 * @description generate new interview report on the basic of the user self description, resume , pdf and job description 
 * @acces private 
 */


interviewRouter.post("/", authMiddleware, upload.single("resume"), interviewController.generateInterViewController)

module.exports = interviewRouter


