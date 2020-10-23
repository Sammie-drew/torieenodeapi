import mongoose from "mongoose";
import Joi from "joi";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
});

const categoryValidator = (category) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(category);
};

const Category = mongoose.model("Categories", categorySchema);

export { Category, categoryValidator };
