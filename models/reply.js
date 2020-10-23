import mongoose from "mongoose";
import Joi from "joi";

const replySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "comments",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
});

const replyValidator = (reply) => {
  const schema = Joi.object({
    text: Joi.string().required().max(255),
    comment: Joi.objectId().required(),
    user: Joi.objectId().required(),
  });
  return schema.validate(reply);
};

const Reply = mongoose.model("replies", replySchema);

export { Reply, replyValidator };
