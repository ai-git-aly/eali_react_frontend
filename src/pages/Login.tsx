import { useAuth } from 'path/to/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Icons } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_ROUTE } from 'path/to/config';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (credentials) => {
        try {
            const response = await fetch(`${API_ROUTE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            login(data);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            // Handle error display to user
        }
    };

    return (
        <div className="login-container">
            {/* Form and other components for login */}
        </div>
    );
};

export default Login;