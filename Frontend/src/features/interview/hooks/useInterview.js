import {getInterviewReports, getInterviewReportById, generateInterviewReport, generateResumePdf} from "../services/Interview.api";
import {useContext} from "react";
import {InterviewContext} from "../interview.context";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    
    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateReport = async ({resumeFile, selfDescription, jobDescription}) => {
        setLoading(true);
        try{
            const response = await generateInterviewReport({resumeFile, selfDescription, jobDescription});
            return response.data;
        } catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true);
        let response = null;
        try{
            response = await getInterviewReportById(interviewId);
            setReport(response.data);
        } catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
        return response.data;
    }

    const getAllReports = async () => {
        setLoading(true);
        let response = null;
        try{
            response = await getInterviewReports();
            setReports(response.data);
        } catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
        return response.data;
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true);
        try{
          const response = await generateResumePdf(interviewReportId);
          // response is already the raw blob data passed back from API service!
          const url = window.URL.createObjectURL(new Blob([response], {type: "application/pdf"}));
          const link = document.createElement("a");
          link.href = url;
          link.download = `Tailored_Resume_${interviewReportId}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        } catch(error){
            console.error("Failed to fetch resume blob:", error);
            alert("Failed to download PDF over the network.");
        } finally{
            setLoading(false);
        }
    }

    return {
        generateReport,
        getReportById,
        getAllReports,
        getResumePdf,
        loading,
        report,
        reports
    }
}
