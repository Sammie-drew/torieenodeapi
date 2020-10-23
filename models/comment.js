import mongoose from "mongoose";
import Joi from "joi";
import { Reply } from "./reply.js";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "posts",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId }],
});

const commentValidator = (comment) => {
  const schema = Joi.object({
    text: Joi.string().required().max(255),
    post: Joi.string().required(),
    user: Joi.objectId().required(),
  });
  return schema.validate(comment);
};

const Comment = mongoose.model("comments", commentSchema);

export { Comment, commentValidator };
