import { Router } from 'express';
const router = Router();
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, addFriend, removeFriend, } from '../../controllers/userController.js';
// /api/users
router.route('/').get(getAllUsers).post(createUser);
// /api/users/:userId
router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);
// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').delete(removeFriend).post(addFriend);
export { router as userRouter };
