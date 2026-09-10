import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        trim: true,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    registrationDeadline: {
      type: Date,
      required: true
    },

    prizes: {
        type: String,
        required: true
    },

    mode: {
        type: String,
        enum: ["online", "offline"],
        default: "online",
    },

      participants: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        }
    ]

}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

hackathonSchema.index(
    { author: 1, title: 1 },
    { unique: true }
);

hackathonSchema.virtual("daysLeft").get(function(){
    const now = new Date();

    if(now < this.startDate) {
        return Math.ceil((this.startDate - now) / (1000 * 60 * 60 * 24));
    }

    if(now >= this.endDate){
        return 0
    }

    return Math.ceil((this.endDate - now) / (1000*60*60*24));
});

const Hackathon = mongoose.model("Hackathon", hackathonSchema);

export default Hackathon;