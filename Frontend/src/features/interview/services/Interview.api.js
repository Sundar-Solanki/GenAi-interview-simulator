import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:2026",
    withCredentials: true,
    
})

/**
 * 
 * @description Service to generate interview report based on user self description, resume and jobDescription 
 */

export const generateInterviewReport = async ({resumeFile, jobDescription, selfDescription}) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    const response = await api.post("/api/interview", formData, {
        headers : {
            "Content-Type" : "multipart/form-data"
        }
    });
    return response.data;
}


/**
 * 
 * @description Service to get interview report by interviewId 
 */

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

/**
 * 
 * @description Service to get all interview reports of logged in user 
 */

export const getInterviewReports = async () => {
   const response = await api.get("/api/interview/");
   return response.data;
}

/**
 * 
 * @description Service to generate resume in pdf format based on interview report id 
 * @returns 
 */

export const generateResumePdf = async (interviewReportId) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, {}, {
        responseType : "blob"
    });
    return response.data;
}
    