import { use } from "react";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

export const getPost = async(req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "get post",
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error "});
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            data: updateProfile
        });        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const uploadProfileImage = async (req, res) => {
  try {

    console.log("USER:", req.user);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
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
    console.log("ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

export const followUser = async (req, res) => {
    try {
        const currUserId = req.user.id;
        const targetUserId = req.params.id;

        
        console.log(targetUserId);

        if(currUserId === targetUserId){
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const currUser = await User.findById(currUserId);
        const userToFollow = await User.findById(targetUserId);

        if(!userToFollow){
            return res.status(404).json({ message: "User not found" });
        }

        if (
            currUser.following.some(
                id => id.toString() === targetUserId
            )
        ) {
            return res.status(400).json({
                message: "You are already following this user"
            });
        }

        currUser.following.push(targetUserId);
        userToFollow.followers.push(currUserId);

        await currUser.save();
        await userToFollow.save();       

        res.status(200).json({
            message:"User followed successfully"
        });        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const unFollowUser = async (req, res) => {
    try {
        const currUserId = req.user.id;
        const targetUserId = req.params.id;

        const currUser = await User.findById(currUserId);
        const userToUnfollow = await User.findById(targetUserId);

        if (!currUser) {
            return res.status(404).json({ message: "Current user not found" });
        }

        if(!userToUnfollow){
            return res.status(404).json({ message: "User not found"});
        }

        currUser.following = currUser.following.filter(id => id.toString() !== targetUserId);

        userToUnfollow.followers = userToUnfollow.followers(id => id.toString !== currUser);

        await currUser.save();
        await userToUnfollow.save();

        res.status(200).json({ message: "Unfollowed user successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}