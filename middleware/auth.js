import jwt from "jsonwebtoken";

const jwtPrivateKey = process.env.jwtPrivateKey;

export default (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = jwt.verify(token, jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};
