import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Signup = () => {
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form action="" className='shadow-xl flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center text-lg font-bold'>NEXORA</h1>
                    <p className='font-semibold text-sm text-gray-600'>Sign up to see photos and videos from your friends</p>
                </div>
                <div>
                    <Label htmlFor="username" className="mb-3 mx-1 font-semibold">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="eg. Krishna"
                        className="focus-visible:ring-transparent"
                    />
                </div>
                <div>
                    <Label htmlFor="email" className="mb-3 mx-1 font-semibold">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="eg. krishna@gmail.com"
                        className="focus-visible:ring-transparent"
                    />
                </div>
                <div>
                    <Label htmlFor="password" className="mb-3 mx-1 font-semibold">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="eg. xyz123"
                        className="focus-visible:ring-transparent"
                    />
                </div>
                <Button
                    className="bg-blue-900 text-white hover:cursor-pointer"
                >
                    Signup
                </Button>
                <p>Already have an account? <span className="text-blue-600 hover:cursor-pointer hover:underline hover:text-blue-900">Login</span></p>
            </form>
        </div>
    )
}

export default Signup;