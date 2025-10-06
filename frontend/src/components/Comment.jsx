import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const Comment = ({ comment }) => {
    return (
        <div className="my-2">
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={comment?.author?.profilePhoto} />
                    <AvatarFallback>DP</AvatarFallback>
                </Avatar>
                <h1 className='font-semibold'>{comment?.author?.username} <span className='font-normal'>{comment?.text}</span></h1>
            </div>
        </div>
    )
}

export default Comment;