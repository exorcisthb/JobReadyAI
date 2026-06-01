import "./config/env.js";

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureSchema } from "./config/database.js";
import { errorMiddleware } from "./middleware/ErrorMiddleware.js";
import { authRoutes } from "./routes/AuthRoutes.js";
import { healthRoutes } from "./routes/HealthRoutes.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import interviewRoutes from "./routes/interview.js";
import uploadRoutes from "./routes/upload.js";
import blogRoutes from "./routes/blog.js";
import cvRoutes from "./routes/cv.js";
import subscriptionRoutes from "./routes/subscription.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api", uploadRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (_request, response) => {
  response.sendFile(path.join(distPath, "index.html"));
});

app.use(errorMiddleware);

ensureSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database schema.", error);
    process.exit(1);
  });
