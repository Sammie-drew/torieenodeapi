import mongoose from "mongoose";
import Joi from "joi";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 255,
    required: true,
  },
  description: {
    type: String,
    maxlength: 1024,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Categories",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const postValidator = (post) => {
  const schema = Joi.object({
    title: Joi.string().required().max(255),
    tags: Joi.array().required(),
    description: Joi.string().required().max(255),
    category: Joi.objectId().required().max(255),
    author: Joi.objectId().required().max(255),
    post: Joi.string().required(),
  });
  return schema.validate(post);
};

const Post = mongoose.model("posts", postSchema);

export { Post, postValidator };
