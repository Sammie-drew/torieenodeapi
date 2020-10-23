import express from "express";

import { register, getPostsForUser, login } from "../controllers/accounts.js";
import {
  getPost,
  createPost,
  createCategory,
  editPost,
  deletePost,
  getPostId,
} from "../controllers/newPost.js";

import {
  getAllCommentForPost,
  createComment,
  getAllReplyForComment,
  createReply,
} from "../controllers/comment.js";
import admin from "../middleware/admin.js";
import auth from "../middleware/auth.js";
import validateObjectId from "../middleware/validateObjectId.js";

export default (app) => {
  const apiRoutes = express.Router();
  const authRoutes = express.Router();
  const postRoutes = express.Router();

  app.use(express.json());

  apiRoutes.use("/accounts", authRoutes);
  apiRoutes.use("/post", postRoutes);

  app.get("/", (req, res) => {
    res.send("Toriee node api.");
  });

  // authentications : register and login
  authRoutes.post("/register", register);
  authRoutes.post("/login", login);

  authRoutes.get("/user/:id/post", getPostsForUser);

  // create Post id = post Id
  postRoutes.get("/", getPost);
  postRoutes.get("/:id", validateObjectId, getPostId);
  postRoutes.post("/create", [auth, admin], createPost);
  postRoutes.put("/editpost/:id", [validateObjectId, auth, admin], editPost);
  postRoutes.delete(
    "/deletepost/:id",
    [validateObjectId, auth, admin],
    deletePost
  );
  postRoutes.post("/createcategory", [auth, admin], createCategory);

  // comments route id = comment ID
  postRoutes.get("/:id/comments", validateObjectId, getAllCommentForPost);
  postRoutes.post("/:id/comments", validateObjectId, createComment);
  postRoutes.get("/:id/reply", [validateObjectId], getAllReplyForComment);
  postRoutes.post("/:id/reply", createReply);

  return app.use("/api", apiRoutes);
};
