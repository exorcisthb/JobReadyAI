import { Router } from "express";
import { HealthController } from "../controller/HealthController.js";

export const healthRoutes = Router();

healthRoutes.get("/health", HealthController.check);
