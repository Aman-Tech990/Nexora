import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
    const { user } = useSelector(store => store.auth);
    return (
        <div className="w-fit my-10 lg:pr-42">
            <div className='flex items-center gap-3'>
                <Link to={`/profile/${user?.id}`}>
                    <Avatar>
                        <AvatarImage src={user?.profilePhoto} alt="Profile_Picture" />
                        <AvatarFallback>DP</AvatarFallback>
                    </Avatar>
                </Link>
                <div className='flex flex-col'>
                    <Link to={`/profile/${user?.id}`}>
                        <h1 className='font-semibold text-sm'>{user?.username}</h1>
                    </Link>
                    <p className='text-gray-600 text-sm'>{user?.bio || "Bio here"}</p>
                </div>
            </div>
            <SuggestedUsers />
        </div>
    )
}

export default RightSidebar;