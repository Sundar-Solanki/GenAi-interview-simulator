const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewRouter = express.Router();
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');
/**
 * @routes POST /api/interview/
 * description generate new interview report on the basis of user self description, resume pdf and job description.
 * @access Private
 */

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)


/**
 * @routes GET /api/interview/report/:interviewId
 * description get interview report by interview id.
 * @access Private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @routes GET /api/interview/
 * description get all interview reports of logged in user.
 * @access Private
 */

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @routes GET /api/interview/resume/pdf
 * description generate resume pdf based on user self description and job description.
 * @access Private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)


module.exports = interviewRouter;