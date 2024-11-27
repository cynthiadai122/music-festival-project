import express from "express";
import { PORT } from "./config/env";
import router from "./routes";
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
