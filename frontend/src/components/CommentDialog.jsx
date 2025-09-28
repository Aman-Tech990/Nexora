import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';

const CommentDialog = ({ open, setOpen }) => {
    return (
        <div>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
                    <div className="flex flex-1">
                        <div className="w-1/2">
                            <img
                                src="/Nexora_01.avif"
                                alt="post_image"
                                className="rounded-l-lg w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-1/2 flex flex-col justify-between">
                            <div className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-1">
                                    <Link>
                                        <Avatar>
                                            <AvatarImage src="" alt="profile_picture" />
                                            <AvatarFallback>DP</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <Link>
                                        <span className="font-semibold text-sm">
                                            username
                                        </span>
                                    </Link>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <MoreHorizontal />
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
                            <div>

                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CommentDialog;