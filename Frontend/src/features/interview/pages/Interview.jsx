import React, { useState, useEffect } from 'react';
import './Interview.scss';
import {useInterview} from '../hooks/useInterview';
import {useParams} from 'react-router';

const Interview = () => {
    const [activeTab, setActiveTab] = useState('technical');
    const {report, getReportById, loading, getResumePdf} = useInterview();
    const {interviewId} = useParams();

    useEffect(() => {
        if(interviewId){
            getReportById(interviewId);
        }
    }, [interviewId])

    // Wait until the report actually has backend data (e.g., matchScore)
    if(loading || !report || typeof report.matchScore === 'undefined'){
        return <main className="interview-layout"><h2 style={{color: 'white', zIndex: 100}}>Loading your personalized report...</h2></main>
    }

    const data = report;

    const renderMainContent = () => {
        switch (activeTab) {
            case 'technical':
                return (
                    <div className="tab-pane fade-in">
                        <h2 className="pane-title">Technical Questions</h2>
                        <div className="cards-grid">
                            {(data.technicalQuestions || []).map((q, idx) => (
                                <div className="question-card" key={idx}>
                                    <div className="card-header">
                                        <span className="topic">Technical</span>
                                        <span className="focus-pill">{q.intention}</span>
                                    </div>
                                    <h3>{q.question}</h3>
                                    <p style={{marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6'}}><strong>Answer Guide:</strong> {q.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'behavioral':
                return (
                    <div className="tab-pane fade-in">
                        <h2 className="pane-title">Behavioral Questions</h2>
                        <div className="cards-grid">
                            {(data.behavioralQuestions || []).map((q, idx) => (
                                <div className="question-card" key={idx}>
                                    <div className="card-header">
                                        <span className="topic">Behavioral</span>
                                        <span className="focus-pill">{q.intention}</span>
                                    </div>
                                    <h3>{q.question}</h3>
                                    <p style={{marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6'}}><strong>Answer Guide:</strong> {q.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'roadmap':
                return (
                    <div className="tab-pane fade-in">
                        <h2 className="pane-title">Preparation Road Map</h2>
                        <ul className="roadmap-list">
                            {(data.preparationSuggestions || []).map((rec, idx) => (
                                <li key={idx} className="roadmap-item">
                                    <div className="node"></div>
                                    <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'inline-block', width: '100%'}}>
                                        <h3 style={{color: '#fff', fontSize: '1.2rem', margin: '0 0 1rem 0'}}>Day {rec.day}: <span style={{color: '#8b5cf6'}}>{rec.focus}</span></h3>
                                        <ul style={{listStyle: 'disc', paddingLeft: '1.5rem', margin: 0, color: '#cbd5e1', lineHeight: '1.8'}}>
                                            {(rec.tasks || []).map((task, tIdx) => (
                                                <li key={tIdx}>{task}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="interview-layout">
            <div className="ambient-orb orb-1"></div>
            <div className="ambient-orb orb-2"></div>
            
            <div className="glass-container">
                {/* LEFT SIDEBAR: NAVIGATION */}
                <aside className="sidebar left-sidebar">
                    <div className="brand-header">
                        <h2>GenAI <span>Report</span></h2>
                    </div>
                    
                    <nav className="side-nav">
                        <button 
                            className={`nav-btn ${activeTab === 'technical' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('technical')}>
                            <span className="icon">💻</span> Technical Questions
                        </button>
                        <button 
                            className={`nav-btn ${activeTab === 'behavioral' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('behavioral')}>
                            <span className="icon">🤝</span> Behavioral Questions
                        </button>
                        <button 
                            className={`nav-btn ${activeTab === 'roadmap' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('roadmap')}>
                            <span className="icon">🗺️</span> Road Map
                        </button>
                    </nav>
                </aside>

                {/* MIDDLE CONTENT: MAIN DATA */}
                <section className="main-content">
                    {renderMainContent()}
                </section>

                {/* RIGHT SIDEBAR: METRICS & GAPS */}
                <aside className="sidebar right-sidebar">
                    <div className="candidate-card" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <div className="avatar">C</div>
                            <div className="info">
                                <h3>Candidate Profile</h3>
                                <p>{data.title || "Target Role"} <span>• Evaluation</span></p>
                            </div>
                        </div>
                        <button 
                            onClick={() => getResumePdf(interviewId)}
                            style={{marginTop: '0.5rem', background: '#8b5cf6', color: 'white', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'}}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download AI Resume
                        </button>
                    </div>

                    <div className="score-container">
                        <div className="circular-progress">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                                <path className="circle-bg"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path className="circle"
                                    strokeDasharray={`${data.matchScore || 0}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <text x="18" y="20.35" className="percentage">{data.matchScore || 0}%</text>
                            </svg>
                        </div>
                        <h4>Match Score</h4>
                    </div>

                    <div className="widget gaps-widget" style={{marginTop: '2rem'}}>
                        <h3>Identified Skill Gaps</h3>
                        <div className="pills-container">
                            {(data.skillGaps || []).map((gap, idx) => (
                                <span key={idx} className="pill missing" title={`Severity: ${gap.severity}\nReason: ${gap.reason}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default Interview;
