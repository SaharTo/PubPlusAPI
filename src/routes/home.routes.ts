import { Router } from "express";
import {
  getHomeData,
  getWorkersData,
  updateStatus,
} from "../controllers/home.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getHomeData);
router.get("/workers", authenticate, getWorkersData);
router.put("/status", authenticate, updateStatus);

export default router;
