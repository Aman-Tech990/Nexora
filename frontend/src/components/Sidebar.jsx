import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setSelectedPost } from '@/redux/postSlice';
import { setPosts } from '@/redux/postSlice';

const Sidebar = () => {

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/user/logout", { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (item) => {
        if (item.text.toLowerCase() === "logout") {
            logoutHandler();
        } else if (item.text.toLowerCase() === "create") {
            setOpen(true);
        }
    }

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar>
                    <AvatarImage src={user?.profilePhoto} alt="@shadcn" />
                    <AvatarFallback>DP</AvatarFallback>
                </Avatar>
            ), text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className='fixed top-0 left-0 px-5 border-r border-gray-300 h-screen hidden sm:block sm:w-[24%] lg:w-[16%] z-10'>
            <div className='flex flex-col'>
                <h1 className='p-6 font-extrabold text-xl'>NEXORA</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item)} key={index} className='flex items-center gap-2 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 mb-3'>
                                    {item.icon}
                                    <span>{item.text}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />

        </div>
    )
}

export default Sidebar;