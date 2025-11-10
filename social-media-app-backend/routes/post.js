import express from 'express';
import { createPost, deletePost, getPosts, likePost, removeLikePost } from '../controller/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../multerConfig.js';

const router = express.Router();

router.post('/createPost', authMiddleware,upload.single('media'), createPost);
router.get("/", authMiddleware, getPosts);
router.put("/:id/like",authMiddleware, likePost);
router.put("/:id/removeLike", authMiddleware, removeLikePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
