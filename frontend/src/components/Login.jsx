import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loader, setLoading] = useState(false);

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/v1/user/login", input,
                {
                    headers:
                        { "Content-Type": "application/json" }, withCredentials: true
                });

            if (res.data.success) {
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
                navigate("/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen w-full'>
            <form onSubmit={loginHandler} className='shadow-xl flex flex-col gap-5 p-8 bg-blue-50 rounded-3xl max-w-sm sm:max-w-md'>
                <div className='mb-4'>
                    <h1 className='text-center text-lg md:text-xl font-bold mb-1'>NEXORA</h1>
                    <p className='font-semibold text-center text-xs sm:text-sm text-gray-600'>Sign up to see photos and videos from your friends</p>
                </div>
                <div>
                    <Label htmlFor="email" className="mb-3 mx-1 font-semibold">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={(e) =>
                            setInput({ ...input, [e.target.name]: e.target.value })
                        }
                        placeholder="eg. krishna@gmail.com"
                        className="focus-visible:ring-transparent"
                    />
                </div>
                <div>
                    <Label htmlFor="password" className="mb-3 mx-1 font-semibold">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={(e) =>
                            setInput({ ...input, [e.target.name]: e.target.value })
                        }
                        placeholder="eg. xyz123"
                        className="focus-visible:ring-transparent"
                    />
                </div>

                {
                    loader ? (
                        <Button>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="bg-blue-900 text-white hover:cursor-pointer"
                        >
                            Login
                        </Button>
                    )
                }

                <p className='text-center'>
                    New User?
                    <Link to="/signup">
                        <span className="text-blue-600 hover:cursor-pointer hover:underline hover:text-blue-900"> Signup </span>
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login;