import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify-token", authenticate, (req, res) => {
  res.json({ valid: true });
});
export default router;
