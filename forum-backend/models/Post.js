const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 200,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
                maxlength: 50,
            },
        ],
        upvotes: {
            type: Number,
            default: 0,
        },
        downvotes: {
            type: Number,
            default: 0,
        },
        ratingSum: {
            type: Number,
            default: 0,
        },
        ratingCount: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

postSchema.pre("save", function (next) {
    this.averageRating =
        this.ratingCount > 0 ? this.ratingSum / this.ratingCount : 0;
    next();
});

postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
