import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import db from "./middleware/db.js";
import config from "./middleware/config.js";
import validation from "./middleware/validation.js";
const app = express();

app.use(cors());

const port = process.env.PORT || 8080;

config();
routes(app);
db();
validation();

app.listen(port, () => console.log(`Listening at localhost:${port}`));
