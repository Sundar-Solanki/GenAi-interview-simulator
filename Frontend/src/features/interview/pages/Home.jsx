import React, { useState, useRef, useEffect } from 'react';
import './Home.scss';
import {useInterview} from '../hooks/useInterview';
import {useNavigate} from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';

const Home = () => {
    const {generateReport, loading, reports, getAllReports} = useInterview();
    const { handleLogout } = useAuth();
    const [jobDescription,setJobDescription] = useState("")
    const [selfDescription,setSelfDescription] = useState("")
    const resumeInputRef = useRef(null)

    useEffect(() => {
        getAllReports();
    }, []);

    const navigate = useNavigate();

    const handleGenerateReport = async () => {
       const resumeFile = resumeInputRef.current?.files?.[0];
       
       if(!resumeFile) {
           alert("Please upload a Candidate Resume PDF before generating the report!");
           return;
       }

       const data = await generateReport({ jobDescription, selfDescription, resumeFile });
       if (data && data._id) {
           navigate(`/interview/${data._id}`);
       }
    }

    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    if(loading){
        return <main> <h1>Loading...</h1></main>
    }


    return (
        <main className="home-container">
            <div className="home-content">
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '-2rem', position: 'relative', zIndex: 10 }}>
                    <button 
                        onClick={async () => {
                            await handleLogout();
                        }}
                        style={{
                            background: 'rgba(255, 59, 48, 0.1)',
                            border: '1px solid rgba(255, 59, 48, 0.3)',
                            color: '#ff3b30',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 59, 48, 0.2)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Logout
                    </button>
                </div>
                <header className="home-header">
                    <h1>Launch Interview <span>Simulator</span></h1>
                    <p>Provide the job context and candidate details to generate a highly tailored interview report.</p>
                </header>

                <div className="form-grid">
                    <div className="card left-card">
                        <div className="input-group full-height">
                            <label htmlFor="jobDescription">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                Job Description
                            </label>
                            <textarea 
                                onChange = {(e)=>setJobDescription(e.target.value)}
                                name="jobDescription" 
                                id="jobDescription" 
                                placeholder="Paste the complete job description here to help us tailor the evaluation criteria..."
                            ></textarea>
                            <div className="glass-glow"></div>
                        </div>
                    </div>

                    <div className="right-section">
                        <div className="card upload-card">
                            <div className="input-group">
                                <label>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="M9 15l3-3 3 3"></path></svg>
                                    Candidate Resume
                                </label>
                                <div className="file-drop-area">
                                    <input 
                                    ref = {resumeInputRef}
                                        type="file" 
                                        name="resume" 
                                        id="resume" 
                                        accept=".pdf" 
                                        className="file-input"
                                        onChange={handleFileChange}
                                    />
                                    <div className="drop-message">
                                        <div className="upload-icon">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                        </div>
                                        <p className="main-msg">Click to map resume</p>
                                        <p className="sub-msg">{fileName ? fileName : "PDF mapping supported"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="input-group">
                                <label htmlFor="selfDescription">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    Self Description
                                </label>
                                <textarea 
                                onChange = {(e)=>setSelfDescription(e.target.value)}
                                    name="selfDescription" 
                                    id="selfDescription" 
                                    placeholder="Brief background or candidate's self-assessment..."
                                ></textarea>
                            </div>
                        </div>

                        <button 
                        onClick={handleGenerateReport}
                        className="generate-btn">
                            <span className="btn-text">Generate AI Report</span>
                            <span className="btn-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Previous Reports Section */}
                {reports && reports.length > 0 && (
                    <div className="previous-reports" style={{marginTop: '4rem', paddingBottom: '2rem'}}>
                        <h2 style={{color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem'}}>Recent Reports</h2>
                        <div className="reports-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
                            {reports.map((rep) => (
                                <div key={rep._id} 
                                     onClick={() => navigate(`/interview/${rep._id}`)}
                                     style={{background: 'rgba(30, 31, 38, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease'}}
                                     onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)' }}
                                     onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(30, 31, 38, 0.6)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                                    <h3 style={{color: '#fff', margin: '0 0 0.5rem 0', fontSize: '1.2rem'}}>{rep.title || "Applicant Evaluation"}</h3>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem'}}>
                                        <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>{new Date(rep.createdAt).toLocaleDateString()}</span>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px'}}>
                                            <span style={{color: '#10b981', fontWeight: 'bold'}}>{rep.matchScore}%</span> 
                                            <span style={{color: '#10b981', fontSize: '0.8rem'}}>Match</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Ambient Background Glows */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>
        </main>
    );
};

export default Home;
