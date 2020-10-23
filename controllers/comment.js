import express from "express";
import { Comment, commentValidator } from "../models/comment.js";
import { Reply, replyValidator } from "../models/reply.js";

const getAllCommentForPost = (req, res) => {
  Comment.find({ post: req.params.id })
    .populate("user", "first_name email")
    .populate("post", "post created")
    .select("-__v")
    .exec((err, comments) => {
      if (err) return res.status(404).send("Not found");
      return res.status(200).send({ comments: comments });
    });
};

const createComment = (req, res) => {
  const { error } = commentValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const comment = new Comment({
    text: req.body.text,
    post: req.body.post,
    user: req.body.user,
  });

  comment.save((err, newComment) => {
    Comment.populate(newComment, "user", (err, mComment) => {
      if (err) return res.status(404).send(err);
      return res.status(201).send(mComment);
    });
  });
};

const getAllReplyForComment = (req, res) => {
  Reply.find({ comment: req.params.id })
    .populate("user", "first_name email")
    .populate("comment", "-__v")
    .exec((err, replies) => {
      if (err) return res.status(404).send(err.message);
      return res.status(200).send({ replies });
    });
};

const createReply = (req, res) => {
  const { error } = replyValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const reply = new Reply({
    text: req.body.text,
    user: req.body.user,
    comment: req.body.comment,
  });
  reply.save((err, newReply) => {
    if (err) return res.status(404).send(err);
    return res.status(201).send({ newReply });
  });
};

export {
  getAllCommentForPost,
  createComment,
  getAllReplyForComment,
  createReply,
};
