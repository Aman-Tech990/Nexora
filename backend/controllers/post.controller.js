import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
    try {
        const authorId = req.id;
        const { caption } = req.body;
        const image = req.file;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image is required!"
            });
        }
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // Buffer to DataURI
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: "author", select: "-password" });
        await post.save();

        return res.status(200).json({
            success: true,
            message: "New Post added successfully!",
            post
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add new post!"
        });
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username, profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: ({ path: "author", select: "username, profilePicture" })
            });
        return res.status(200).json({
            success: true,
            message: "All Posts fetched successfully!",
            posts
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Failed to fetch all posts!"
        });
    }
}

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username, profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username, profilePicture"
                }
            });
        return res.status(200).json({
            success: true,
            message: "User posts fetched successfully!",
            posts
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Failed to fetch User post!"
        });
    }
}

export const likePost = async (req, res) => {
    try {
        const userToLikeId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }

        // Like Logic
        await Post.updateOne({ $addToSet: { likes: userToLikeId } });
        await post.save();

        // Implementing socket.io for real-time notification

        return res.status(200).json({
            success: true,
            message: "Post liked!"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to like post!"
        });
    }
}

export const dislikePost = async (req, res) => {
    try {
        const userToDislikeId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }

        // Dislike Logic
        await Post.updateOne({ $pull: { likes: userToDislikeId } });
        await post.save();

        // Implementing socket.io for real-time notification!

        return res.status(200).json({
            success: true,
            message: "Post disliked!"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to dislike Post!"
        });
    }
}

export const addComment = async (req, res) => {
    try {
        const userToCommentId = req.id;
        const postId = req.params.id;
        const { text } = req.body;
        const post = Post.findById(postId);
        if (!text) {
            return res.status(404).json({
                success: false,
                message: "Text body is required!"
            });
        }
        const comment = await Comment.create({
            text,
            author: userToCommentId,
            post: postId
        }).populate({
            path: "author",
            select: "username, profilePicture"
        });

        post.comment.push(comment._id);
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Comment added successfully!",
            comment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add comments!"
        });
    }
}

export const getCommentsForPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId })
            .populate({ path: "author", select: "username, profilePicture" });
        if (!comments) {
            return res.status(404).json({
                success: false,
                message: "No comments found for this post!"
            });
        }
        return res.status(200).json({
            success: true,
            message: "All comments fetched successfully!",
            comments
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch all comments!"
        });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }

        // To check if user is authorized (Owner can deleted) 
        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                success: false,
                message: "User unauthorized!"
            });
        }

        // Delete Post Logic
        await Post.findByIdAndDelete(postId);

        // Remove the post ID from the User's Post
        let user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }
        user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // Deleted Associated Comment
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully!"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete post!"
        });
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const authorId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }
        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }
        if (user.bookmarks.includes(post._id)) {
            // Remove from Bookmark
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                success: true,
                type: 'unsaved',
                message: "Post unbookmarked successfully!"
            });
        } else {
            // Bookmark Logic
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            return res.status(200).json({
                success: true,
                type: 'saved',
                message: "Post bookmarked successfully!"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to bookmark post!"
        });
    }
}