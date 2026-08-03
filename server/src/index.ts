import express from "express";
import cors from "cors";
import { recipesRouter } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/recipes", recipesRouter);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Recipe Box API running on http://localhost:${PORT}`);
});