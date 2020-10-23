export default (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(403).send("You dont have access , contact admin");

  next();
};
