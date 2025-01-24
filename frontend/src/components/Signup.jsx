import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';


const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(Store=>Store.auth);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const validateInput = () => {
        const { username, email, password } = input;

        // Username validation
        const usernamePattern = /^[a-z0-9._]+$/; // Only allows lowercase letters, digits, ., and _
        if (!usernamePattern.test(username)) {
            toast.error("Username must not contain special characters (except '.' and '_') or capital letters.");
            return false;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        // Password validation
        const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{9,}$/; // At least 1 uppercase, 1 special character, 1 digit, and min 9 characters
        if (!passwordPattern.test(password)) {
            toast.error("Password must contain at least one uppercase letter, one special character, one digit, and be longer than 8 characters.");
            return false;
        }

        return true;
    };

    const signupHandler = async (e) => {
        e.preventDefault();

        // Validate input before sending to the server
        if (!validateInput()) {
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:3000/api/v1/user/register', input, {  
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
                </div>
                <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit'>Signup</Button>
                    )
                }
                <span className='text-center'>Already have an account?
                    <Link to="/login" className='text-blue-600'>Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Signup;
