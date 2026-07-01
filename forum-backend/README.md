# Forum Backend API

## Folder Structure

```
forum-backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   └── forumController.js      # Business logic for all endpoints
├── middleware/
│   ├── async.js               # Async handler wrapper
│   └── errorHandler.js        # Centralized error handling
├── models/
│   ├── User.js                # User schema
│   ├── Post.js                # Post schema
│   ├── Comment.js             # Comment schema with nested reply support
│   └── Rating.js              # Rating/Reaction schema
├── routes/
│   └── forum.js               # API route definitions
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies
└── server.js                  # Main entry point
```

## API Endpoints

### Posts

- **POST /api/posts** - Create a new post
- **GET /api/posts** - Get all posts (query: page, limit, sortBy[latest|popular], tag)
- **GET /api/posts/:id** - Get a specific post

### Comments

- **POST /api/posts/:id/comments** - Add a comment to a post
- **GET /api/posts/:id/comments** - Get all comments for a post (includes replies)

### Ratings

- **POST /api/posts/:id/rate** - Rate a post (body: userId, value[1-5] OR reaction[upvote|downvote])
- **POST /api/comments/:id/rate** - Rate a comment (same body format)

## Installation

```bash
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm run dev
```

## Response Format

All responses follow: `{ success: true/false, message: string, data: object/array, count/total/page }`
