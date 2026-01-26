// Login.tsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/login', { email, password });
            // Handle successful login (e.g. redirect or update state)
        } catch (err) {
            // Improved error handling based on error status
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        setError('Invalid credentials. Please try again.');
                        break;
                    case 404:
                        setError('API endpoint not found.');
                        break;
                    default:
                        setError('An unexpected error occurred. Please try again later.');
                }
            } else {
                setError('Network error. Please check your connection.');
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;