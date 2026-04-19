import React, {useState} from 'react';
import '../auth.form.scss';
import { useNavigate, Link } from 'react-router';  // hook
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const {username, setUsername} = useState('');
    const {email, setEmail} = useState('');
    const {password, setPassword} = useState('');

    const {handleRegister, loading} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister(username, email, password);
        navigate('/');
    }
    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }
    
    return (
       <main className="auth-main">
         <div className="auth-container">
            <div className="auth-glass-panel">
                <div className="form-header">
                    <h1>Create Account</h1>
                    <p>Join GenAI to get started</p>
                </div>
                <div className="form-body">
                    <form action="">
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input onChange={(e) => setUsername(e.target.value)}
                            id="username" type="text" placeholder="Choose a username" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)}
                             id="email" type="email" placeholder="Enter your email" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)}
                            id="password" type="password" placeholder="Create a password" />
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Sign Up</button>
                        
                        <div className="auth-footer">
                            <p>Already have an account? <a href="/login">Sign in</a></p>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Background glowing orbs for aesthetics */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
         </div>
       </main>
    )
}

export default Register;