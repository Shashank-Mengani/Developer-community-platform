import { use } from "react";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { AppError } from "../utils/AppError.js";

export const getPost = async(req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password");

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            message: "get post",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async(req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            data: updateProfile
        });        

    } catch (error) {
        next(error);
    }
}

export const uploadProfileImage = async (req, res, next) => {
  try {

    console.log("USER:", req.user);
    console.log("FILE:", req.file);

    if (!req.file) {
        throw new AppError("No image uploaded", 400);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "devpost/avatars-images"
    });

    console.log("CLOUDINARY:", result);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profileImage: result.secure_url
      },
      { new: true }
    );

    res.status(200).json({
      message: "Avatar image uploaded successfully",
      profileImage: user.profileImage
    });

  } catch (error) {
        next(error);
  }
};

export const followUser = async (req, res, next) => {
    try {
        const currUserId = req.user.id;
        const targetUserId = req.params.id;

        
        console.log(targetUserId);

        if(currUserId === targetUserId){
            throw new AppError("You cannot follow yourself", 400);
        }

        const currUser = await User.findById(currUserId);
        const userToFollow = await User.findById(targetUserId);

        if(!userToFollow){
            throw new AppError("User not found", 404);
        }

        if (
            currUser.following.some(
                id => id.toString() === targetUserId
            )
        ) {
            throw new AppError("You are already following this user", 400);
        }

        currUser.following.push(targetUserId);
        userToFollow.followers.push(currUserId);

        await currUser.save();
        await userToFollow.save();       

        res.status(200).json({
            message:"User followed successfully"
        });        
    } catch (error) {
        next(error);
    }
}

export const unFollowUser = async (req, res, next) => {
    try {
        const currUserId = req.user.id;
        const targetUserId = req.params.id;

        const currUser = await User.findById(currUserId);
        const userToUnfollow = await User.findById(targetUserId);

        if (!currUser) {
            throw new AppError("Current user not found", 404);
        }

        if(!userToUnfollow){
            throw new AppError("User not found", 404);
        }

        currUser.following = currUser.following.filter(id => id.toString() !== targetUserId);

        userToUnfollow.followers = userToUnfollow.followers(id => id.toString !== currUser);

        await currUser.save();
        await userToUnfollow.save();

        res.status(200).json({ message: "Unfollowed user successfully" });

    } catch (error) {
        next(error);
    }
}