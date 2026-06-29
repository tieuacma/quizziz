const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const { asyncHandler } = require('../middleware/async');

const createPost = asyncHandler(async (req, res) => {
  const { title, content, author, tags } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({
      success: false,
      message: 'Title, content, and author are required'
    });
  }

  const post = await Post.create({
    title,
    content,
    author,
    tags: tags || []
  });

  const populatedPost = await Post.findById(post._id).populate('author', 'username email');

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: populatedPost
  });
});

const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'latest';
  const tag = req.query.tag;

  const skip = (page - 1) * limit;
  const filter = tag ? { tags: tag } : {};

  let sortQuery = {};
  if (sortBy === 'popular') {
    sortQuery = { upvotes: -1, createdAt: -1 };
  } else {
    sortQuery = { createdAt: -1 };
  }

  const posts = await Post.find(filter)
    .populate('author', 'username email')
    .sort(sortQuery)
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: posts
  });
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username email');

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

const addComment = asyncHandler(async (req, res) => {
  const { content, author, parentCommentId } = req.body;
  const postId = req.params.id;

  if (!content || !author) {
    return res.status(400).json({
      success: false,
      message: 'Content and author are required'
    });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }
    if (parentComment.postId.toString() !== postId) {
      return res.status(400).json({
        success: false,
        message: 'Parent comment does not belong to this post'
      });
    }
  }

  const comment = await Comment.create({
    postId,
    author,
    content,
    parentCommentId: parentCommentId || null
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate('author', 'username email')
    .populate('parentCommentId', 'content author');

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: populatedComment
  });
});

const getCommentsByPostId = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  const comments = await Comment.find({ 
    postId,
    parentCommentId: { $exists: false }
  })
    .populate('author', 'username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
    const replies = await Comment.find({ parentCommentId: comment._id })
      .populate('author', 'username email parentCommentId')
      .sort({ createdAt: -1 });
    return { ...comment.toObject(), replies };
  }));

  const total = await Comment.countDocuments({ postId, parentCommentId: { $exists: false } });

  res.status(200).json({
    success: true,
    count: commentsWithReplies.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: commentsWithReplies
  });
});

const ratePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { userId, value, reaction } = req.body;

  if (!userId || (!value && !reaction)) {
    return res.status(400).json({
      success: false,
      message: 'userId and either value (1-5) or reaction (upvote/downvote) are required'
    });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  const existingRating = await Rating.findOne({
    userId,
    targetId: postId,
    targetType: 'Post'
  });

  if (existingRating) {
    if (value) {
      post.ratingSum = post.ratingSum - (existingRating.value || 0) + value;
      existingRating.value = value;
      existingRating.reaction = null;
    } else if (reaction) {
      if (existingRating.reaction === reaction) {
        return res.status(200).json({
          success: true,
          message: 'Rating already recorded',
          data: { upvotes: post.upvotes, downvotes: post.downvotes }
        });
      }
      if (existingRating.reaction === 'upvote') post.upvotes--;
      if (existingRating.reaction === 'downvote') post.downvotes--;
      if (reaction === 'upvote') post.upvotes++;
      if (reaction === 'downvote') post.downvotes++;
      existingRating.reaction = reaction;
    }
    await Promise.all([post.save(), existingRating.save()]);
  } else {
    if (value) {
      post.ratingSum += value;
      post.ratingCount += 1;
      await Rating.create({
        userId,
        targetId: postId,
        targetType: 'Post',
        value
      });
    }
    if (reaction === 'upvote') post.upvotes += 1;
    if (reaction === 'downvote') post.downvotes += 1;
    await post.save();
    if (reaction) {
      await Rating.create({
        userId,
        targetId: postId,
        targetType: 'Post',
        reaction
      });
    }
  }

  res.status(200).json({
    success: true,
    message: 'Rating recorded successfully',
    data: {
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      averageRating: post.averageRating
    }
  });
});

const rateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const { userId, value, reaction } = req.body;

  if (!userId || (!value && !reaction)) {
    return res.status(400).json({
      success: false,
      message: 'userId and either value (1-5) or reaction (upvote/downvote) are required'
    });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  const existingRating = await Rating.findOne({
    userId,
    targetId: commentId,
    targetType: 'Comment'
  });

  if (existingRating) {
    if (value) {
      existingRating.value = value;
      existingRating.reaction = null;
    } else if (reaction) {
      if (existingRating.reaction === reaction) {
        return res.status(200).json({
          success: true,
          message: 'Rating already recorded',
          data: { upvotes: comment.upvotes, downvotes: comment.downvotes }
        });
      }
      if (existingRating.reaction === 'upvote') comment.upvotes--;
      if (existingRating.reaction === 'downvote') comment.downvotes--;
      if (reaction === 'upvote') comment.upvotes++;
      if (reaction === 'downvote') comment.downvotes++;
      existingRating.reaction = reaction;
    }
    await Promise.all([comment.save(), existingRating.save()]);
  } else {
    if (reaction === 'upvote') comment.upvotes += 1;
    if (reaction === 'downvote') comment.downvotes += 1;
    await comment.save();
    await Rating.create({
      userId,
      targetId: commentId,
      targetType: 'Comment',
      value,
      reaction
    });
  }

  res.status(200).json({
    success: true,
    message: 'Rating recorded successfully',
    data: {
      upvotes: comment.upvotes,
      downvotes: comment.downvotes
    }
  });
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  addComment,
  getCommentsByPostId,
  ratePost,
  rateComment
};