const {GoogleGenAI} = require("@google/genai");
const {z} = require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey : process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore : z.number().describe("The match score between 0 to 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions : z.array(
        z.object({
            question : z.string().describe("The Technical question can be asked in the interview"),
            intention : z.string().describe("The intention of the interviewer behind asking this question"),
            answer : z.string().describe("How to answer this question , what points to be included in the answer, what approach to be taken")
        }).describe("The technical questions that can be asked in the interview")
    ),
    behavioralQuestions : z.array(
        z.object({
            question : z.string().describe("The Behavioral question can be asked in the interview"),
            intention : z.string().describe("The intention of the interviewer behind asking this question"),
            answer : z.string().describe("How to answer this question , what points to be included in the answer, what approach to be taken")
        }).describe("The behavioral questions that can be asked in the interview")
    ),
    skillGaps : z.array(
        z.object({
            skill : z.string().describe("The skill that is missing in the candidate"),
            severity : z.enum(["low", "medium", "high"]).describe("The severity of the skill gap"),
            reason : z.string().describe("The reason why this skill is missing in the candidate")
        }).describe("The skill gaps that are present in the candidate")
    ),
    preparationSuggestions : z.array(
        z.object({
            day : z.number().describe("The day of the preparation"),
            focus : z.string().describe("The focus of the preparation"),
            tasks : z.array(z.string()).describe("The tasks to be done in the preparation")
        }).describe("The preparation suggestions for the candidate")
    ),
    title: z.string().describe("The title of the job for which the interview report is generated")
    
}).describe("The interview report for the candidate")

async function runWithRetry(apiCallFn, maxRetries = 2) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await apiCallFn();
        } catch (error) {
            const isRateLimit = error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("Quota exceeded");
            if (isRateLimit && attempt < maxRetries) {
                console.warn(`[Gemini API] Rate Limit Enforced (429). Backing off for 31 seconds before Attempt ${attempt + 1}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, 31000));
            } else {
                throw error; // If it's a completely different error or max retries hit, throw natively
            }
        }
    }
}

async function generateInterviewReport(resume, selfDescription, jobDescription) {
    try {
        const response = await runWithRetry(() => ai.models.generateContent({
            model : "gemini-2.0-flash",
            contents : `
            Generate an interview report based on the following information.
            Resume: ${resume}
            Self Description: ${selfDescription}
            Job Description: ${jobDescription}
            
            You must return ONLY a JSON object that strictly follows this structure:
            {
                "matchScore": <number between 0 and 100>,
                "technicalQuestions": [
                    { "question": "<string>", "intention": "<string>", "answer": "<string>" }
                ],
                "behavioralQuestions": [
                    { "question": "<string>", "intention": "<string>", "answer": "<string>" }
                ],
                "skillGaps": [
                    { "skill": "<string>", "severity": "<low|medium|high>", "reason": "<string>" }
                ],
                "preparationSuggestions": [
                    { "day": <number>, "focus": "<string>", "tasks": ["<string>"] }
                ]
            }
            Do not include Markdown formatting like \`\`\`json. Return only the raw JSON string.
            `,
            config : {
                responseMimeType : "application/json"
            }
        }));
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating interview report:", error?.message || error);
        if (error?.status === 503) {
            console.error("The Gemini API is currently unavailable or experiencing high demand. Please try again later.");
        }
        return null; // Return null or handle the error gracefully so it doesn't crash the server
    }
}



async function invokeGeminiAi() {
    try {
        const response = await runWithRetry(() => ai.models.generateContent({
            model : "gemini-2.0-flash",
            contents : "Hello Gemini ! Explain what is Java ?",
        }));
        console.log(response.text);
        return response.text;
    } catch (error) {
        console.error("Error invoking Gemini AI:", error?.message || error);
        return null;
    }
}

async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch({
        headless : true,
        args : ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
        format : "A4",
        printBackground : true,
        margin : {
            top : "1cm",
            right : "1cm",
            bottom : "1cm",
            left : "1cm"
        }
    })
    await browser.close();
    return pdfBuffer;
}



async function generateResumePdf({resume, selfDescription, jobDescription}){
    const resumePdfSchema = z.object({
        html : z.string().describe("The HTML content of the resume which can be converted to PDF using puppeteer")
    })

    const prompt = `
    Generate a resume in HTML format based on the following information.
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    You must return ONLY a JSON object that strictly follows this structure:
    the resume should be tailored for the given job description and should highlight the skills and experience that are relevant to the job description.
    the content of the resume should be not sound like AI generated and should be human-like.
    you can highlight the content using some colors or different font styles. but the overall resume design should be professional and modern.
    `
    

const response = await runWithRetry(() => ai.models.generateContent({
    model : "gemini-2.0-flash",
    contents : prompt,
    config : {
        responseMimeType : "application/json",
        responseSchema : zodToJsonSchema(resumePdfSchema)
    }
}));

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    let jsonContent = {};
    try {
        jsonContent = JSON.parse(rawText);
    } catch (err) {
        throw new Error("AI returned unparseable JSON format.");
    }

    if (!jsonContent.html) {
        throw new Error("AI skipped generating the 'html' property in its JSON payload.");
    }

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;

}

module.exports =  {generateInterviewReport, generateResumePdf}
