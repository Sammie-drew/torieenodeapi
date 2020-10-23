let jwtPrivateKey = process.env.jwtPrivateKey;
export default () => {
  if (!jwtPrivateKey) {
    throw new Error("FATAL ERROR: >>> jwtPrivateKey is not defined");
  }
};
