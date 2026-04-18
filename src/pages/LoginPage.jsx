import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [keepMe, setKeepMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
  const { user, login } = useAuth();

    const handleLogin = async (e) => {

        e.preventDefault();
        setErrorMsg('');
        // setIsLoading(true);

        try {
            await login(email, password, "HUB_MANAGER");
        } catch (err) {
            console.log(err?.message)
            // setError(err?.message || 'Login failed');
        } finally {
            // setLoading(false);
        }

        // try {
        //     const response = await fetch('https://api.itfixer199.com/api/login', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             username: email,
        //             password: password,
        //             role: "HUB_MANAGER",
        //             login_type: "PASSWORD",
        //             device_type: "WEB",
        //             device_id: "webapp",
        //             device_name: "billing-webapp",
        //             ip_address: "0.0.0.0"
        //         })
        //     });

        //     const data = await response.json();

        //     if (!response.ok) {
        //         throw new Error(data.message || data.detail || 'Login failed. Please check your credentials.');
        //     }

        //     const storage = localStorage;
        //     storage.setItem('access_token', data?.tokens?.access || data?.access || '');
        //     storage.setItem('refresh_token', data?.tokens?.refresh || data?.refresh || '');
        //     storage.setItem('
        // ', JSON.stringify(data?.user || {}));
        //     if (data?.agent) {
        //         storage.setItem('agent', JSON.stringify(data.agent));
        //     }

        //     onLogin();
        //     navigate('/dashboard');
        // } catch (error) {
        //     console.error('Login error:', error);
        //     setErrorMsg(error.message || 'An error occurred during login.');
        // } finally {
        //     setIsLoading(false);
        // }
    };

    return (
        <div className="login-bg">
            <div className="login-center">
                {/* Logo */}
                <div className="login-logo-wrap">
                    <div className="login-logo">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="5" width="20" height="14" rx="3" stroke="#fff" strokeWidth="1.8" />
                            <rect x="6" y="9" width="12" height="2" rx="1" fill="#fff" />
                            <rect x="6" y="13" width="7" height="2" rx="1" fill="#fff" />
                        </svg>
                    </div>
                </div>

                <h1 className="login-title">FTDS Billing</h1>
                <p className="login-sub">Precision financial management for clinics.</p>

                <div className="login-card">
                    {/* Encrypted banner */}
                    <div className="login-banner">
                        <span className="login-banner-icon">🛡</span>
                        END-TO-END ENCRYPTED ACCESS
                    </div>

                    {errorMsg && (
                        <div className="login-error" style={{ color: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: '10px 15px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>⚠️</span> {errorMsg}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="login-field">
                            <label>Email Address</label>
                            <div className="login-input-wrap">
                                <span className="login-input-icon">@</span>
                                <input
                                    type="email"
                                    placeholder="name@clinic.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            {/* <div className="login-field-row">
                                <label>Password</label>
                                <a href="#" className="login-forgot">Forgot Password?</a>
                            </div> */}
                            <div className="login-input-wrap">
                                <span className="login-input-icon">🔒</span>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button type="button" className="login-show-btn" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? '🙈' : '👁'}
                                </button>
                            </div>
                        </div>

                        {/* <label className="login-check">
                            <input type="checkbox" checked={keepMe} onChange={e => setKeepMe(e.target.checked)} />
                            <span>Keep me logged in</span>
                        </label> */}

                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In \u00a0\u2192'}
                        </button>
                    </form>

                    {/* <div className="login-support">
                        Need assistance? <a href="#">Contact Support</a>
                    </div> */}
                </div>

                {/* Footer badges */}
                <div className="login-badges">
                    <span>🛡 HIPAA COMPLIANT</span>
                    <span>🔒 SOC2 CERTIFIED</span>
                    <span>🔒 SSL SECURED</span>
                </div>
                <p className="login-copy">© 2024 FTDS Pro. All rights reserved. Access to this ledger is restricted to authorized personnel only.</p>
            </div>
        </div>
    );
}
