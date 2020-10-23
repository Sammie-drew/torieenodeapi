import { User, userValidator } from "../models/auth/user.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import _ from "lodash";

export const register = async (req, res) => {
  const { error } = userValidator(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) return res.status(400).send({ error: "User already Exits" });

    user = new User(
      _.pick(req.body, [
        "first_name",
        "last_name",
        "email",
        "password",
        "isAdmin",
      ])
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res.header("authorization", token).send({
      Credential: _.pick(user, [
        "_id",
        "first_name",
        "last_name",
        "email",
        "isAdmin",
      ]),
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const login = async (req, res) => {
  const { error } = loginValidator(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({
      email: req.body.email,
    });
    if (!user) return res.status(400).send("User does not exists");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();

    res.status(200).send({
      jwtToken: token,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getPostsForUser = (req, res) => {
  User.find({ _id: req.params.id })
    .populate("category")
    .populate("author")
    .exec((err, post) => {
      if (err) return res.json(err);
      return res.status(200).send(post);
    });
};

const loginValidator = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required().max(255).min(5),
    password: Joi.string().required().min(5).max(1024),
  });
  return schema.validate(user);
};
