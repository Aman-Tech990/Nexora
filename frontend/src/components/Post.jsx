import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog';
import { Input } from './ui/input';
import { useState } from 'react';

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);

    const changeEventHandler = (e) => {
        if (e.target.value.trim()) {
            setText(e.target.value);
        } else {
            setText("");
        }
    }
    return (
        <div className="my-8 w-full max-w-sm mx-auto">
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src="" alt="post_image" />
                        <AvatarFallback>DP</AvatarFallback>
                    </Avatar>
                    <h1>Username</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button variant="outline" className="font-bold text-red-600 cursor-pointer w-fit">Unfollow</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit">Add to Favorites</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit font-bold text-red-500">Delete</Button>
                    </DialogContent>
                </Dialog>
            </div>
            {/* Post Image */}
            <img
                src={post.image}
                alt="person&laptop"
                className="rounded-sm my-2 w-full aspect-square object-cover"
            />
            {/*  */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <FaRegHeart size={22} className='cursor-pointer' />
                    <MessageCircle size={22} className='cursor-pointer' onClick={() => setOpen(true)} />
                    <Send size={22} className='cursor-pointer' />
                </div>
                <Bookmark />
            </div>
            <div>
                <span className='font-medium mb-2 block'>1K Likes</span>
                <p>
                    <span className='font-medium mr-2 cursor-pointer'>username</span>
                    {post.caption || "."}
                </p>
                <span className='cursor-pointer text-sm text-gray-500' onClick={() => setOpen(true)}>View all 10 comments</span>
                <CommentDialog open={open} setOpen={setOpen} />
                <div className='flex items-center justify-between mt-2'>
                    <input
                        type="text"
                        name="text"
                        value={text}
                        onChange={changeEventHandler}
                        placeholder="Add a comment..."
                        className="outline-none text-sm w-full"
                    />
                    {
                        text && <span className='text-[#3BADF8] font-semibold cursor-pointer'>Post</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default Post;