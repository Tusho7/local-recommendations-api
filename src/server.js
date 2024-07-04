import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import bodyParser from "body-parser";

const app = express();
dotenv.config();

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });


app.use("/api/auth", userRoutes);
app.use("/", categoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
