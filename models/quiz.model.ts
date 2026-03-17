import mongoose, { Schema, Model, model, models } from 'mongoose';

interface IQuiz {
    _id: string;
    title: string;
    subject: string;
    classId: string;
    description: string;
    questions: any[];
    createdAt: Date;
    updatedAt: Date;
}

const QuizSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    classId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    questions: [{
        type: mongoose.Schema.Types.Mixed
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'quizzes',
    versionKey: false
});

// Simple pre-save hook without typing issues
QuizSchema.pre('save', function () {
    this.updatedAt = new Date();
});

type QuizModel = Model<IQuiz>;

export const Quiz = (models.Quiz as QuizModel) || model<IQuiz>('Quiz', QuizSchema);

