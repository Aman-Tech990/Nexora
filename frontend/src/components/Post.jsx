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
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';

const Post = ({ post }) => {
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (res.data.status) {
                console.log(res.data.comment);
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = posts.map(
                    p => p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.reponse.data.message);
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? "dislike" : "like";
            const res = await axios.get(`http://localhost:5000/api/v1/post/${post?._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedLike = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLike);
                setLiked(!liked);
                const updatedPostData = posts.map(p => p._id === post._id
                    ? {
                        ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                )
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(console.error());
            toast.error(error.response.data.message);
        }
    }


    const deletePostHandler = async (e) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/v1/post/delete/${post._id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id != post?._id);
                toast.success(res.data.message);
                dispatch(setPosts(updatedPostData));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.reponse.data.message);
        }
    }

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
                        <AvatarImage src={post.author.profilePicture} alt="post_image" />
                        <AvatarFallback>DP</AvatarFallback>
                    </Avatar>
                    <h1>{post.author.username}</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button variant="outline" className="font-bold text-red-600 cursor-pointer w-fit">Unfollow</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit">Add to Favorites</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit font-bold text-red-500" onClick={deletePostHandler}>Delete</Button>
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
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={22} className='cursor-pointer text-red-600' /> : <FaRegHeart size={22} className='cursor-pointer' onClick={likeOrDislikeHandler} />
                    }
                    <MessageCircle size={22} className='cursor-pointer' onClick={() => setOpen(true)} />
                    <Send size={22} className='cursor-pointer' />
                </div>
                <Bookmark />
            </div>
            <div>
                <span className='font-medium mb-2 block'>{postLike} likes</span>
                <p>
                    <span className='font-medium mr-2 cursor-pointer'>{post.author.username}</span>
                    {post.caption || "."}
                </p>
                <span className='cursor-pointer text-sm text-gray-500' onClick={() => setOpen(true)}>View all {comment.length} comments</span>
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
                        text && <span onClick={commentHandler} className='text-[#3BADF8] font-semibold cursor-pointer'>Post</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default Post;