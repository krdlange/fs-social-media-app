import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "..controllers/posts.js";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// read
router.get("/", verifyToken, getFeedPosts); //to grab user feed when on homepage
router.get("/:userId/posts", verifyToken, getUserPosts); //

// update
router.patch("/:id/like", verifyToken, likePost);

export default router;
