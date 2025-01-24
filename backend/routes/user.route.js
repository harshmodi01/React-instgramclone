import express from "express";
import { 
    editProfile, 
    followOrUnfollow, 
    forgatePassword, 
    getProfile, 
    getSuggestedUsers, 
    login, 
    logout, 
    register, 
    resetPassword,
    verifyResetToken,
    forgot_resetPassword,
    adminlogin,
    getAllUsers,
    deleteUser,
    getAllPost,
    deletePostbyadmin,
    search,
} from "../controllers/user.controller.js"; // Added resetPassword
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followOrUnfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/forgate-password').post(forgatePassword);
router.route('/reset-password/:resetToken').post(resetPassword); // Fixed the chaining issue
router.route('/verify-token/:token').get(verifyResetToken);
router.route('/forgot-reset-password').post(forgot_resetPassword); // Add the reset password route
router.route('/admin/adminlogin').post(adminlogin);
router.route('/admin/admingetAllUsers').get(isAuthenticated, getAllUsers);
router.route('/admin/deleteUser/:id').delete(isAuthenticated,deleteUser);
router.route('/admin/adminAllPost').get(isAuthenticated, getAllPost);
router.route('/admin/deletePostbyadmin/:id').delete(isAuthenticated,deletePostbyadmin);
router.route('/search').get(search);

export default router;