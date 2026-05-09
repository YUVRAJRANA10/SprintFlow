import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import taskRoutes from "./routes/taskRoutes.js";
import metricsRoutes from "./routes/metrics.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js"
dotenv.config()



connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/metrics", metricsRoutes);

app.get("/", (req,res) => {

    res.json({message : "SprintLens backend is running"});
})

app.use(notFound);
app.use(errorHandler);







const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});