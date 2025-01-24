import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { Input } from './ui/input'; // Assuming you have the same Input component as Login
import { Button } from './ui/button'; // Assuming you have the same Button component as Login
import { toast } from 'sonner'; // Assuming you're using the same toast for notifications


function ResetPassword() {
    const { token } = useParams();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email');
    const [validToken, setValidToken] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/user/verify-token/${token}?email=${email}`);
                if (response.data.message === 'Token is valid, you can reset your password') {
                    setValidToken(true);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token, email]);

    const handlePasswordReset = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/user/forgot-reset-password`, {
                token, // The token from the URL
                email, // The email from the query parameters
                newPassword // The new password entered by the user
            });
    
            // Handle successful password reset (e.g., show a success message or redirect the user)
            console.log(response.data.message); // Log the success message
            // You can add a toast notification or a redirect here
        } catch (error) {
            console.error(error);
            // Handle error (e.g., show error message)
            const errorMessage = error.response?.data?.message || 'An error occurred while resetting your password.';
            // Display the error message (e.g., using a toast or alert)
            alert(errorMessage);
        }
    };
    

    if (loading) return <div>Loading...</div>;

    if (!validToken) return <div>Invalid or expired token</div>;

   
    return (
        <div className="flex items-center w-screen h-screen justify-center">
            <form onSubmit={handlePasswordReset} className="shadow-lg flex flex-col gap-5 p-8">
                <div className="my-4">
                    <h1 className="text-center font-bold text-xl">Reset Password</h1>
                    <p className="text-sm text-center">
                        Please enter a new password to reset your account.
                    </p>
                </div>
                <div>
                    <span className="font-medium">New Password</span>
                    <Input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="focus-visible:ring-transparent my-2 p-2 border rounded"
                        required
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
            </form>
        </div>
    );



}

export default ResetPassword;





