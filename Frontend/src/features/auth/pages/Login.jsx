import React, {useState} from 'react';
import '../auth.form.scss';
import { useAuth } from '../hooks/useAuth';
import {useNavigate} from 'react-router';

const Login = () => {
    const {handleLogin, loading} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await handleLogin(email, password);
        if(success) {
            navigate('/');
        } else {
            alert('Login failed. Please check your credentials.');
        }
    }
    if(loading){
        return <div> <h1>Loading...</h1></div>
    }

    return (
       <main className="auth-main">
         <div className="auth-container">
            <div className="auth-glass-panel">
                <div className="form-header">
                    <h1>Welcome Back</h1>
                    <p>Log in to continue to GenAI</p>
                </div>
                <div className="form-body">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)}
                            id="email" type="email" placeholder="Enter your email" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)}
                            id="password" type="password" placeholder="Enter your password" />
                        </div>
                        <div className="form-actions">
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                        <button type="submit" className="btn-primary">Sign In</button>
                        
                        <div className="auth-footer">
                            <p>Don't have an account? <a href="/register">Sign up</a></p>
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

export default Login;