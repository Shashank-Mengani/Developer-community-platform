import Hackathon from "../models/hackathon.model.js";
import { AppError } from "../utils/AppError.js"

export const postHackathon = async (req, res, next) => {
    try {
        
        const userId = req.user.id;
        const { title, imageUrl, startDate, endDate, registrationDeadline, prizes, mode } = req.body;

        const existing = await Hackathon.findOne({
            author: userId,
            title
        });

        if(existing){
            throw new AppError("hackathon Already exists", 409);
        }

        const hackathon = await Hackathon.create({
            author: userId,
            title,
            imageUrl,
            startDate,
            endDate,
            registrationDeadline,
            prizes,
            mode
        });

        res.status(201).json({
            message: "Hackathon created successfully",
            data: hackathon
        });

    } catch (error) {
        next(error);
    }
}

export const getHackathons = async (req, res, next) => {
    try {
        
        const hackathons = await Hackathon.find().populate("author", "name");

        res.status(200).json({
            message: "Hackathons fetched successfully",
            data: hackathons
        });

    } catch (error) {
        next(error);
    }
}

export const getHackathonById = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user.id;

    if (!hackathonId) {
      throw new AppError("Hackathon ID is required", 400);
    }

    const hackathon = await Hackathon.findById(hackathonId)
      .populate("author", "name username");

    if (!hackathon) {
      throw new AppError("Hackathon was not found", 404);
    }

    const isRegistered = hackathon.participants.some(
      (participant) =>
        participant.toString() === userId.toString()
    );

    res.status(200).json({
      message: "Fetched Hackathon successfully",
      data: {
        ...hackathon.toObject(),
        isRegistered,
        participantsCount: hackathon.participants.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const searchHackathon = async (req, res, next) => {
    try {
        
        const { search } = req.query;

        if(!search?.trim()) {
            throw new AppError("Search query is required", 400);
        }

        const escapeRegex = (string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        };

        const searchQuery = escapeRegex(search.trim());

        const hackathon = await Hackathon.find({
            title: {
                $regex: searchQuery,
                $options: "i"
            }
        }).populate("author", "name")
           .sort({ createdAt: - 1});

        res.status(200).json({
            message: "hackathon was found",
            data: hackathon
        });

    } catch (error) {
        next(error);
    }
}

export const deleteHackathon = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { hackathonId } = req.params;

        const hackathon = await Hackathon.findById(hackathonId);

        if(!hackathon){
            throw new AppError("Hackathon was not found", 404);
        }

        if(hackathon.author.toString() !== userId.toString()){
            throw new AppError("You are not authorized to delete this question", 403);
        }

        await Hackathon.findByIdAndDelete(hackathonId);

        res.status(200).json({
            message: "Hackathon deleted successfully",
            data: hackathon
        });

    } catch (error) {
        next(error);
    }
}

export const registerHackathon = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { hackathonId } = req.params;

        const hackathon = await Hackathon.findById(hackathonId);

        if (!hackathon) {
            throw new AppError("Hackathon was not found", 404);
        }

        if(hackathon.author.toString() === userId.toString()){
            throw new AppError("Hackathon organizer cannot register", 400);
        }

        const alreadyRegistered = hackathon.participants.some(
            (participant) => participant.toString() === userId.toString()
        );

        if (alreadyRegistered) {
            throw new AppError("You are already registered for this hackathon", 409);
        }

        hackathon.participants.push(userId);

        await hackathon.save();    

        res.status(201).json({
            message: "Registered for hackathon successfully",
            data: {
                hackathonId: hackathon._id,
                userId,
                participantsCount: hackathon.participants.length
            }
        });

    } catch (error) {
        next(error);
    }
}

export const unregisterHackathon = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      throw new AppError("Hackathon was not found", 404);
    }

    const participantIndex = hackathon.participants.findIndex(
      (participant) =>
        participant.toString() === userId.toString()
    );

    if (participantIndex === -1) {
      throw new AppError(
        "You are not registered for this hackathon",
        400
      );
    }

    hackathon.participants.splice(participantIndex, 1);

    await hackathon.save();

    res.status(200).json({
      message: "Unregistered from hackathon successfully",
      data: {
        hackathonId: hackathon._id,
        participantsCount: hackathon.participants.length
      }
    });
  } catch (error) {
    next(error);
  }
};