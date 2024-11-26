import { Router } from "express";
import { getFestivals } from "../controllers/festivalController";

const router = Router();

router.get("/api/festivals", getFestivals);

export default router;
