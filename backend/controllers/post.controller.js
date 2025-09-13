import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file.path;
        const authorId = req.id;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image are required!"
            });
        }

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .jpeg({ quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri, { folder: "posts" });
        const newPost = new Post({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(newPost._id);
            await user.save();
        }
        await newPost.populate({ path: "author", select: "-password" });
        await newPost.save();

        return res.status(201).json({
            success: true,
            message: "Post added successfully!",
            post: newPost
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add post!"
        });
    }
}

export const allPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate({ path: "author", select: "username, profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: { path: "author", select: "username, profilePicture" }
            });
        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully!",
            posts
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch posts!"
        });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({ path: "author", select: "username, profilePicture" }).populate({ path: "comments", sort: { createdAt: -1 }, populate: { path: "author", select: "username, profilePicture" } });
        return res.status(200).json({
            success: true,
            message: "User's posts fetched successfully!",
            posts
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user's posts!"
        });
    }
}