import User from "./user.model.js";

export const createPost = async(req, res) => {
    try {
        const { avatar, bio, role } = req.body;

        const user = await User.create({
            avatar: avatar,
            bio: bio,
            role: role
        });

        res.status(201).json({
            message: "created post",
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error "});
    }
}