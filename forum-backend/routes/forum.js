const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  addComment,
  getCommentsByPostId,
  ratePost,
  rateComment
} = require('../controllers/forumController');

router.post('/posts', createPost);
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);

router.post('/posts/:id/comments', addComment);
router.get('/posts/:id/comments', getCommentsByPostId);

router.post('/posts/:id/rate', ratePost);
router.post('/comments/:id/rate', rateComment);

module.exports = router;