import React, { useState } from 'react';
import axios from 'axios';
import { Input } from './ui/input'; // Assuming you have the same Input component as Login
import { Button } from './ui/button'; // Assuming you have the same Button component as Login
import { toast } from 'sonner'; // Assuming you're using the same toast for notifications
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize navigate for routing

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/api/v1/user/forgate-password', { email });
            toast.success(response.data.message); // Show success message
            setEmail(''); // Reset email field after submission
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error occurred'); // Show error message
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login'); // Navigate back to login page
    };

    return (
        <div className="flex items-center w-screen h-screen justify-center">
            <form onSubmit={handleSubmit} className="shadow-lg flex flex-col gap-5 p-8">
                <div className="my-4">
                    <h1 className="text-center font-bold text-xl">LOGO</h1>
                    <p className="text-sm text-center">
                        Enter your email address to receive a password reset link.
                    </p>
                </div>
                <div>
                    <span className="font-medium">Email</span>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="focus-visible:ring-transparent my-2"
                        required
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                {/* Back to login button */}
                <Button type="button" onClick={handleBackToLogin} disabled={loading}>
                    Back to Login 
                </Button>
            </form>
        </div>
    );
}

export default ForgotPassword;
