import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import Comment from './Comment';
import store from '@/redux/store';
import axios from 'axios';
import { toast } from 'sonner';
import Posts from './Posts';
import { setPosts } from '@/redux/postSlice';

const CommentDialog = ({ open, setOpen }) => {
    const { selectedPost } = useSelector(store => store.post);
    const [text, setText] = useState("");
    const [comment, setComment] = useState([]);

    const changeEventHandler = (e) => {
        if (e.target.value.trim()) {
            setText(e.target.value);
        } else {
            setText("");
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.status) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = Posts.map(p => p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p);
                setPosts(updatedPostData);
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
                    <div className="flex flex-1">
                        <div className="w-1/2">
                            <img
                                src={selectedPost?.image}
                                alt="post_image"
                                className="rounded-l-lg w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-1/2 flex flex-col justify-between">
                            <div className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-1">
                                    <Link>
                                        <Avatar>
                                            <AvatarImage src={selectedPost?.author?.profilePhoto} alt="profile_picture" />
                                            <AvatarFallback>DP</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <Link>
                                        <span className="font-semibold text-sm">
                                            {selectedPost?.author?.username}
                                        </span>
                                    </Link>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <MoreHorizontal className="cursor-pointer" />
                                    </DialogTrigger>
                                    <DialogContent className="flex flex-col">
                                        <Button variant="outline" className="text-red-500 cursor-pointer">Report</Button>
                                        <Button variant="outline" className="text-red-500 cursor-pointer">Unfollow</Button>
                                        <Button variant="outline" className="cursor-pointer">Add to Favorites</Button>
                                        <Button variant="outline" className="cursor-pointer">Go to Post</Button>
                                        <Button variant="outline" className="cursor-pointer">Share to..</Button>
                                        <Button variant="outline" className="cursor-pointer">Copy link</Button>
                                        <Button variant="outline" className="cursor-pointer">Embed</Button>
                                        <Button variant="outline" className="cursor-pointer">About this account</Button>
                                        <Button variant="outline" className="text-red-500 cursor-pointer">Delete</Button>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <hr />
                            <div className='flex-1 items-center overflow-y-auto max-h-96 p-4'>
                                {
                                    selectedPost?.comments.map((comment) => <Comment key={comment._id} comment={comment} />)
                                }
                            </div>
                            <div className="p-4 flex items-center gap-2">
                                <input
                                    type="text"
                                    name="text"
                                    value={text}
                                    onChange={changeEventHandler}
                                    placeholder="Add a comment.."
                                    className="outline-none w-full border border-gray-300 p-2 rounded-md"
                                />
                                <Button
                                    variant="outline"
                                    disabled={!text.trim()}
                                    onClick={commentHandler}
                                    className="cursor-pointer"
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CommentDialog;