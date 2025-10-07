# Blog Analytics (MERN)

A minimal MERN stack app with authentication, posts, comments, and analytics/insights. Frontend uses React + Vite with Milligram CSS and Recharts. Backend is Node/Express with MongoDB (Mongoose) and JWT auth.

---
---

## Features

* User registration & login (JWT)
* Create/read/update/delete posts (author-only for update/delete)
* Create/read/delete comments (comment author **or** post author can delete)
* Analytics/Insights:

  * Totals (posts, comments)
  * Posts/day and Comments/day timeseries
  * Top 5 most-commented posts
  * Top authors by number of posts
* Clean, minimal UI using Milligram
* Bar chart for daily posts using Recharts

---

## Tech Stack

**Backend**

* Node.js, Express
* MongoDB, Mongoose
* JWT (jsonwebtoken), bcryptjs
* CORS, dotenv

**Frontend**

* React (Vite)
* react-router-dom
* Milligram 1.4.1 (CDN)
* Recharts 3.x (bar chart)

---

## Architecture & Decisions

* **ES Modules** (`type: module` style imports) across server.
* **JWT Auth**: `protect` middleware validates token, loads user, attaches `req.user`.
* **Source of Truth for authorship**:

  * **Posts**: `author` is set from `req.user.username` on the server (not accepted from client) to prevent spoofing. previously added from client when testing with post man.
  * **Comments**: `commenter` is set from `req.user.username`.
* **Permissions**:

  * Post update/delete allowed only if `post.author === req.user.username`.
  * Comment delete allowed if `comment.commenter === req.user.username` **OR** the associated post's `author === req.user.username`.
* **Cascade Delete**: Deleting a post removes its comments via `Comment.deleteMany({ post: postId })`.
* **Insights** are read-only and public for demo simplicity; can be protected later if needed.

---

## Database Schema

### User

```js
{
  _id: ObjectId,
  username: String (unique, required, 3..30),
  email: String (unique, required, valid email),
  password: String (hashed, select: false),
  createdAt: Date,
  updatedAt: Date
}
```

* Hashing via `bcryptjs` in a pre-save hook.
* Instance method `comparePassword(candidate)`.

### Post

```js
{
  _id: ObjectId,
  title: String (required, max 200),
  content: String (required),
  author: String (required) // username of the creator
  createdAt: Date,
  updatedAt: Date
}
```

* Virtual `commentCount` via Mongoose virtual or aggregation when listing.

### Comment

```js
{
  _id: ObjectId,
  text: String (required, max 1000),
  commenter: String (required), // username of the commenter
  post: ObjectId (ref: 'Post', required),
  createdAt: Date,
  updatedAt: Date
}
```

* Index on `{ post: 1, createdAt: -1 }` for efficient fetch/sort.

---

## API Endpoints

### Auth

* **POST** `/api/auth/register` → `{ username, email, password }` → `{ data: { _id, username, email, token } }`
* **POST** `/api/auth/login` → `{ email, password }` → `{ data: { _id, username, email, token } }`
* **GET** `/api/auth/me` (protected) → `{ data: user }`

### Posts

* **POST** `/api/posts` (protected) → create post (server sets `author` from token)
* **GET** `/api/posts` → list posts with `commentCount`; supports `?search=&author=&page=&limit=`
* **GET** `/api/posts/:id` → single post + `commentCount`
* **PUT** `/api/posts/:id` (protected, author-only) → update title/content
* **DELETE** `/api/posts/:id` (protected, author-only) → delete + cascade comments

### Comments

* **POST** `/api/comments/:postId` (protected) → create comment (`commenter` from token)
* **GET** `/api/comments/:postId` → list comments (supports `?page=&limit=`)
* **PUT** `/api/comments/:commentId` (protected, owner-only) → edit comment text
* **DELETE** `/api/comments/:commentId` (protected) → allowed for **comment owner** or **post owner**

### Insights

* **GET** `/api/insights/overview?days=7` →

```json
{
  "success": true,
  "data": {
    "totals": { "posts": 10, "comments": 25 },
    "timeseries": {
      "posts": [{"date":"2025-10-01","count":3}, ...],
      "comments": [{"date":"2025-10-01","count":7}, ...]
    },
    "leaders": {
      "authors": [{"author":"user1","posts":5}, ...],
      "commenters": [{"commenter":"user2","comments":8}, ...]
    }
  }
}
```

* **GET** `/api/insights/top-posts?limit=5` →

```json
{
  "success": true,
  "data": [
    { "postId":"...","title":"Post A","author":"user1","commentCount":7 },
    ...
  ]
}
```

* **GET** `/api/insights/recent-activity?limit=10` → latest posts/comments arrays.

---

## Auth & Permissions

* **JWT** returned on register/login.
* Clients pass `Authorization: Bearer <token>` for protected routes.
* Server trusts `req.user` populated by middleware; never trusts client-supplied `author`/`commenter`.
* Post update/delete requires ownership. Comment delete requires comment ownership **or** post ownership.

---

## Setup & Run

### Backend

```bash
npm install
# ensure .env is configured
node server.js    # or: npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open Vite URL (e.g., [http://localhost:5173](http://localhost:5173))


Both can run from root directory as well

### Root Directory

"scripts" = {
 "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "npm run dev --workspace=server",
    "dev:client": "npm run dev --workspace=client",

  }

---
---

## Future Improvements

* Refresh tokens + token blacklist on logout
* Role-based access (admin)
* Rich text for posts (MD/Quill) and image uploads
* Rate limiting & input sanitization
* More charts (comments/day line chart, top commenters over time)
* Unit/integration tests

---

**License**: MIT (or per your preference)
