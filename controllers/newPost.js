import { Post, postValidator } from "../models/post.js";
import { Category, categoryValidator } from "../models/category.js";
import { User } from "../models/auth/user.js";

export const getPost = (req, res) => {
  Post.find({}, (err, newPost) => {
    if (err) return res.status(404).send(err.message);
    return res.status(200).json(newPost);
  })
    .populate("author", "first_name last_name email -_id")
    .populate("category", "name -_id")
    .select(" title tags post description author created");
};

export const getPostId = (req, res) => {
  Post.findById({ _id: req.params.id }, (err, post) => {
    if (err) return res.status(404).send("post not found");
    return res.status(200).send(post);
  })
    .populate("author", "first_name last_name email -_id")
    .populate("category", "name -_id")
    .select(" title tags post description author created");
};

export const createCategory = (req, res) => {
  const { error } = categoryValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let category = Category.findOne({
    name: req.body.name,
  });
  if (category)
    return res.status(400).send({ error: "Category already exits" });
  category = new Category({
    name: req.body.name,
  });

  category.save((err, newCategory) => {
    if (err) return res.status(500).send(err.message);
    return res.status(201).send(newCategory);
  });
};

export const createPost = async (req, res) => {
  const { error } = postValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let author = await User.findById({
    _id: req.body.author,
  });
  if (!author) return res.status(404).send("User does not exist");

  let category = await Category.findById({
    _id: req.body.category,
  });
  if (!category) return res.status(404).send("Category does not exist");

  const post = new Post({
    title: req.body.title,
    post: req.body.post,
    description: req.body.description,
    tags: req.body.tags,
    author: req.body.author,
    category: req.body.category,
  });
  post.save((err, newPost) => {
    if (err) return res.status(400).send(err.message);
    return res.status(201).send(newPost);
  });
};

export const editPost = (req, res) => {
  const { error } = postValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  Post.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        post: req.body.post,
        description: req.body.description,
        tags: req.body.tags,
        author: req.body.author,
        category: req.body.category,
      },
    },
    { new: true },
    (err, post) => {
      if (err) return res.status(404).send(err.message);
      return res.status(201).send(post);
    }
  );
};

export const deletePost = (req, res) => {
  Post.findByIdAndRemove({ id: req.params.id }, (err, post) => {
    if (err) return res.status(404).send("Post with the given id not found");
    return res.status(200).send("post deleted");
  });
};
