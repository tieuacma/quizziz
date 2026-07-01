const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        targetType: {
            type: String,
            enum: ["Post", "Comment"],
            required: true,
        },
        value: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        reaction: {
            type: String,
            enum: ["upvote", "downvote"],
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

ratingSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });
ratingSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model("Rating", ratingSchema);
