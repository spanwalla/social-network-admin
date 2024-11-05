import express from 'express';
import * as userController from '../controllers/userController.js';
import * as followController from '../controllers/followController.js';
import * as postController from '../controllers/postController.js';
import {uploadImage} from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/user', userController.getAllUsers);
router.post('/user/filter', userController.getUsersByQuery);
router.get('/user/:id', userController.getUserById);
router.get('/user/:id/following', userController.getUserFollowing);
router.get('/user/:id/followers', userController.getUserFollowers);
router.post('/user', uploadImage.single('avatar'), userController.registerUser);
router.patch('/user/:id', uploadImage.single('avatar'), userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.post('/subscribe', followController.followUser);
router.post('/post', uploadImage.array('media', 3), postController.createPost);
router.get('/post', postController.getAllPosts);
router.get('/post/:id', postController.getPostById);
router.get('/feed/:id', postController.getUserFeed);

// TODO: Отдельный роутер под /api/user
// TODO: API добавление, удаление из друзей

export default router;