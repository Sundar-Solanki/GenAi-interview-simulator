import {createContext, useState, useContext} from 'react';

export const InterviewContext = createContext();

export const InterviewProvider = ({children}) => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState([]);

    const getInterviewReports = async () => {
        setLoading(true);
        try {
            const response = await getInterviewReports();
            setReports(response.data);
        } catch (error) {
            setReport(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <InterviewContext.Provider value={{reports, setReports, loading, setLoading, report, setReport}}>
            {children}
        </InterviewContext.Provider>
    )
}

export const useInterview = () => useContext(InterviewContext);