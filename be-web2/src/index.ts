import express from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import pembicaraRoutes from "./routes/pembicaraRoute.js"
import userRoutes from "./routes/userRoute.js"
import authRoutes from "./routes/authRoutes.js"

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes);
app.use("/speakers", pembicaraRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});