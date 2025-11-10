import express from 'express';
import { editUserProfile, getUserProfile } from '../controller/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../multerConfig.js';

const router = express.Router();

router.get('/:id', authMiddleware, getUserProfile);
router.put('/edit', authMiddleware,upload.single('image'), editUserProfile);
export default router;
