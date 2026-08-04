const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterViewController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const resumeContent = pdfData.text;

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAI = await generateInterviewReport({
            resumeText: resumeContent,
            selfDescription,
            jobDescription,
        });

        if (!interviewReportByAI) {
            return res.status(500).json({
                message: "AI failed to generate report",
            });
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAI,
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message,
        });
    }
}

module.exports = {
    generateInterViewController,
};
