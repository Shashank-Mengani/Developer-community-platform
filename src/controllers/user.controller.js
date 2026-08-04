import User from "../models/user.model.js";

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