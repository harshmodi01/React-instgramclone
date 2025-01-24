import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link as LucideLink, Store } from 'lucide-react'; // Rename Link from lucide-react to avoid conflict
import { Link, useNavigate } from 'react-router-dom'; // Keep Link from react-router-dom
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const adminlogin = () => {
    const [input, setInput] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(Store=>Store.auth);
    const navigate = useNavigate();
    const Dispatch =useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler1 = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const res = await axios.post('http://localhost:3000/api/v1/user/admin/adminlogin', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                Dispatch(setAuthUser(res.data.user));
                navigate("/admin/admingetAllUsers");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/admin/adminlogin");
        }
    },[])
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler1} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>Admin Login</h1>
                    {/* <p className='text-sm text-center'>login to see photos & videos from your friends</p> */}
                </div>
                <div>
                    <span className='font-medium'>UserName</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username} // Use the input state here
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password} // Use the input state here
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>              
                <Button type='submit' disabled={loading}>Login</Button>              
            </form>
        </div>
    );
}

export default adminlogin;
