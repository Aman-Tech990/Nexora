import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';

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