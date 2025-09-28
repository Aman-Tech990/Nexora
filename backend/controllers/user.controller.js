import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                success: false,
                message: "All fields are required!"
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully!"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register!"
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Incorrect email or password!"
            });
        }
        const isPasswordMatched = await bcrypt.compare(password, user?.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password!"
            });
        }

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )

        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePhoto: user.profilePhoto,
            bio: user.bio,
            gender: user.gender,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
        };

        return res
            .status(200)
            .cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 1 * 24 * 60 * 60 * 1000 })
            .json({
                success: true,
                message: `Welcome back ${user.username}!`,
                user: userResponse
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login!"
        });
    }
}

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            success: true,
            message: "User logged out successfully!"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout!"
        });
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select("-password");
        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully!",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile!"
        });
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePhoto = req.file;

        let cloudResponse;

        if (profilePhoto) {
            const fileUri = getDataUri(profilePhoto);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePhoto) user.profilePhoto = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user profile!"
        });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                success: false,
                message: "No users available!"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully!",
            suggestedUsers
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to suggest user!"
        });
    }
}

export const followUnfollow = async (req, res) => {
    try {
        const followedBy = req.id;
        const followedTo = req.params.id;
        if (followedBy === followedTo) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow/unfollow yourself!"
            });
        }

        const [user, targetUser] = await Promise.all([
            User.findById(followedBy),
            User.findById(followedTo)
        ]);

        if (!user || !targetUser) {
            return res.status(400).json({
                success: false,
                message: "User not found!"
            });
        }

        // To check whether to follow or unfollow
        const isFollowing = user.following.includes(followedTo);
        if (isFollowing) {
            // Unfollow Logic
            await Promise.all([
                User.updateOne({ _id: followedBy }, { $pull: { following: followedTo } }),
                User.updateOne({ _id: followedTo }, { $pull: { followers: followedBy } })
            ]);
            return res.status(200).json({
                success: true,
                action: "unfollow",
                message: "Unfollowed successfully!"
            });
        } else {
            // Follow Logic
            await Promise.all([
                User.updateOne({ _id: followedBy }, { $push: { following: followedTo } }),
                User.updateOne({ _id: followedTo }, { $push: { followers: followedBy } })
            ]);
            return res.status(200).json({
                success: true,
                action: "follow",
                message: "Followed successfully!"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch Follower/Following Data!"
        });
    }
}

