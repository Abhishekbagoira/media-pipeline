import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadSingleImage } from "../middleware/upload.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/", requireAuth, uploadSingleImage, uploadImage);

export default router;
