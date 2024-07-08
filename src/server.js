import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import recommendationRoutes from "./routes/recommendationController.js";
import bodyParser from "body-parser";
import contactRoutes from "./routes/contactRoutes.js";
import wsServer from "./utils/notification.js";
import adminRoutes from "./routes/adminRoutes.js";
import metricsRoutes from "./routes/metrics.js";

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
app.use("/", recommendationRoutes);
app.use("/", contactRoutes);
app.use("/", adminRoutes);
app.use("/", metricsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

wsServer.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log('Message from client:', message);
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});