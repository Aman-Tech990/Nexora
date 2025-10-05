import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {

    const imageRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataURI = await readFileAsDataURL(file);
            setImagePreview(dataURI);
        }
    }

    const createPostHandler = async (e) => {
        const formData = new FormData();
        formData.append("caption", caption);
        if (imagePreview) {
            formData.append("image", file);
        }
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/v1/post/addpost",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }
            );
            if (res.data.success) {
                dispatch(setPosts([res.data.post, ...posts]));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => setOpen(false)}>
                    <DialogHeader
                        className="text-center font-semibold"
                    >
                        Create New Post
                    </DialogHeader>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user?.profilePhoto} alt="img" />
                            <AvatarFallback>DP</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-sm font-semibold">{user?.username}</h1>
                            <span className="text-sm text-gray-600">bio here...</span>
                        </div>
                    </div>
                    <Textarea
                        className="focus-visible:ring-transparent border-none"
                        placeholder="Write a caption.."
                        name="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    {
                        imagePreview && (
                            <div className="w-full h-64 flex justify-center items-center">
                                <img src={imagePreview} alt="preview-img" className="object-cover w-full h-full rounded-md" />
                            </div>
                        )
                    }
                    <input
                        ref={imageRef}
                        type="file"
                        className="hidden"
                        onChange={fileChangeHandler}
                    />
                    <Button
                        className="w-fit mx-auto bg-[#0095F6] hover:bg-[#0665a5] cursor-pointer"
                        onClick={() => imageRef.current.click()}
                    >
                        Select from device
                    </Button>
                    {
                        imagePreview && (
                            loading ? (
                                <Button>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) :
                                (
                                    <Button
                                        type="submit"
                                        onClick={createPostHandler}
                                        className="hover:bg-blue-950 cursor-pointer"
                                    >
                                        Post
                                    </Button>
                                )
                        )
                    }
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreatePost;