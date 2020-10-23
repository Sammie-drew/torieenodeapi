import mongoose from "mongoose";
import config from "config";

export default () => {
  mongoose.connect(
    config.get("db"),
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => console.log("Connected to mongodb")
  );
};
