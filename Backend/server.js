require("dotenv").config();
const app = require("./src/app");
const ConnectToDB = require("./src/config/database");
// const {invokeGeminiAi} = require("./src/services/ai.service");
// const {resume, selfDescription, jobDescription} = require("./src/services/resumeData.js");
// const generateInterviewReport = require("./src/services/ai.service");


ConnectToDB();
// invokeGeminiAi();
// generateInterviewReport(resume, selfDescription, jobDescription);
const PORT = 2026;
app.listen(PORT, () => {
    console.log(`Your Backend Server is Currenlty Running on http://localhost:${PORT}`);
})

