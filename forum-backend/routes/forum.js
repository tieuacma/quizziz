import express from 'express';
const router = express.Router();

import {
    createPost,
    getPosts,
    getPostById,
    addComment,
    getCommentsByPostId,
    ratePost,
    rateComment,
} from '../controllers/forumController.js';

router.post("/posts", createPost);
router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);

router.post("/posts/:id/comments", addComment);
router.get("/posts/:id/comments", getCommentsByPostId);

router.post("/posts/:id/rate", ratePost);
router.post("/comments/:id/rate", rateComment);

module.exports = router;
