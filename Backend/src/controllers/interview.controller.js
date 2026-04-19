const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service");
const InterviewReportModel = require("../models/InterviewReport.model");

/**
 @description Controller to generate interview report based on user self description, resume and jobDescription
 */



async function generateInterviewReportController(req, res) {
    const resumeFile = req.file

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const {selfDescription , jobDescription} = req.body
    const interViewReportByAI = await generateInterviewReport(
        resumeContent.text,
        selfDescription,
        jobDescription
    )

    if (!interViewReportByAI) {
        return res.status(500).json({ error: "Failed to generate interview report from AI" });
    }

    const interviewReport = await InterviewReportModel.create({
        resume : resumeContent.text,
        selfDescription : selfDescription,
        jobDescription : jobDescription,
        matchScore : interViewReportByAI.matchScore,
        technicalQuestions : interViewReportByAI.technicalQuestions,
        behavioralQuestions : interViewReportByAI.behavioralQuestions,
        skillGaps : interViewReportByAI.skillGaps,
        preparationSuggestions : interViewReportByAI.preparationSuggestions,
        user : req.user._id
    })

    res.status(201).json({
        message : "Interview report generated successfully",
        data : interviewReport
    })
}


/**
 description Controller to get interview report by interviewId.
 */

 async function getInterviewReportByIdController(req, res) {
    const {interviewId} = req.params;
    try {
        const interviewReport = await InterviewReportModel.findById(interviewId);
        if (!interviewReport) {
            return res.status(404).json({ error: "Interview report not found" });
        }
        res.status(200).json({
            message : "Interview report fetched successfully",
            data : interviewReport
        });
    } catch (error) {
        return res.status(400).json({ error: "Invalid interview ID format." });
    }
 }


 /**
  * @description Controller to get all interview reports of logged in user.
  */

 async function getAllInterviewReportsController(req, res) {
    const interviewReports = await InterviewReportModel.find({user : req.user._id}).sort({createdAt : -1}).select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationSuggestions")
    res.status(200).json({
        message : "Interview reports fetched successfully",
        data : interviewReports
    })
 }


 /**
  * @description Controller to genearte resume pdf based on user self description and job description.
  */

 async function generateResumePdfController(req, res) {
    try {
        const {interviewReportId} = req.params;
        const interviewReport = await InterviewReportModel.findById(interviewReportId);
        if (!interviewReport) {
            return res.status(404).json({ error: "Interview report not found" });
        }
        
        const {resume, selfDescription, jobDescription} = interviewReport;
        const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription});
        
        if (!pdfBuffer) {
            return res.status(500).json({ error: "PDF Generation yielded no buffer." });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        return res.status(500).json({ error: error.message || "Something went wrong generating the PDF" });
    }
 }

module.exports = {generateInterviewReportController , getInterviewReportByIdController,getAllInterviewReportsController, generateResumePdfController}