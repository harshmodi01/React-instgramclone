
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}



export const resetPassword=async(req,res)=>{
    const { resetToken } = req.params;
    const { password } = req.body;

    try {
        // Find the user by the reset token and check if it hasn't expired
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() } // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password and remove the reset token and expiration
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}




export const forgatePassword = async (req, res) => {
    const { email } = req.body;
    console.log(email);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Store the reset token in the vcode field
        user.vcode = resetToken; 
        user.resetPasswordExpire = Date.now() + 3600000; // Set expiration time to 1 hour from now

        await user.save();

        // Create reset URL with email and token
        const resetURL = `http://localhost:5173/forgot-reset-password/${resetToken}?email=${encodeURIComponent(email)}`;

        // Send reset email with Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "21bmiit090@gmail.com",  // Use environment variables
                pass: "nvih qzsm envq gcfw" // "nzjvatftqtorhnya"  // Use environment variables  nvih qzsm envq gcfw
            }
        });
        const mailOptions = {
            from: "21bmiit090@gmail.com",
            to: user.email,
            subject: 'Password Reset',
            html: `Click on the following link to reset your password: <a href="${resetURL}">Reset Password</a>` // Use HTML to make the link clickable
        };

        await transporter.sendMail(mailOptions);

        return res.json({ message: 'Password reset email sent!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const verifyResetToken = async (req, res) => {
    const { token } = req.params; // Get token from URL
    const { email } = req.query; // Get email from query string
    console.log(token);
    console.log(email);
    try {
        const user = await User.findOne({ email, vcode: token });
        console.log("hfcthgvgjvyyhvhgv");
        console.log(user)
        // Check if the user exists and if the token is valid and not expired
        if (!user || !user.vcode) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        return res.json({ message: 'Token is valid, you can reset your password' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const forgot_resetPassword = async (req, res) => {
    const { token, email, newPassword } = req.body; // Get token, email, and new password from request body

    try {
        // Find the user by email and check if the token is valid and not expired
        const user = await User.findOne({ 
            email, 
            vcode: token//, 
            //resetPasswordExpire: { $gt: Date.now() } // Check if the token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password and clear reset token and expiration
        user.password = hashedPassword;
        user.vcode = undefined; // Clear the reset token
        //user.resetPasswordExpire = undefined; // Clear the expiration time

        await user.save();

        return res.json({ message: 'Password has been successfully reset' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks').populate('favorites');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};


export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // patel
        const jiskoFollowKrunga = req.params.id; // shivani
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}
export const adminlogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Define static credentials
        const adminUsername = "admin";
        const adminPassword = "admin";
        
        // Check if username and password match the static credentials
        if (username === adminUsername && password === adminPassword) {
            // Generate a token for the session
            const token = await jwt.sign({ username: adminUsername }, process.env.SECRET_KEY, { expiresIn: '1d' });

            // Return a response with the token and success message
            return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
                message: "Welcome, Admin!",
                success: true,
                redirectTo: "/adminuser"  // Frontend can use this to redirect
            });
        } else {
            // If credentials don't match, send an error response
            return res.status(401).json({
                message: "Invalid username or password",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred",
            success: false,
        });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const AllUsers = await User.find().select("-password");
        if (!AllUsers || AllUsers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Currently do not have any users',
            });
        }
        return res.status(200).json({
            success: true,
            users: AllUsers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred',
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // First, delete the posts created by the user
        const deletedPosts = await Post.deleteMany({ author: id });

        if (deletedPosts.deletedCount === 0) {
            console.log('No posts found for this user');
        } else {
            console.log(`${deletedPosts.deletedCount} posts deleted for user ${id}`);
        }

        // Now, delete the user
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'User and their posts deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const getAllPost = async (req, res) => {
    try {
        const allPosts = await Post.find().populate('author', 'username').populate('comments');
        if (!allPosts || allPosts.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Currently do not have any Post',
            });
        }
        return res.status(200).json({
            success: true,
            posts: allPosts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred',
        });
    }
};

export const deletePostbyadmin = async (req, res) => {
    const postId = req.params.id;
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred',
        });
    }
};
export const search = async (req, res) => {
    const { username } = req.query; // Get the username from query parameter
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const users = await User.find({
            username: { $regex: username, $options: 'i' } // Case-insensitive search
        }).select('username profilePicture bio id'); // Select only necessary fields

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
}







// import { User } from '../models/user.model.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer'; // Ensure you have installed nodemailer
// import getDataUri from '../utils/datauri.js';
// import cloudinary from '../utils/cloudinary.js';
// import { Post } from '../models/post.model.js';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// // Register a new user
// export const register = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         if (!username || !email || !password) {
//             return res.status(401).json({
//                 message: 'Something is missing, please check!',
//                 success: false,
//             });
//         }
//         const user = await User.findOne({ email });
//         if (user) {
//             return res.status(401).json({
//                 message: 'Try a different email',
//                 success: false,
//             });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         await User.create({
//             username,
//             email,
//             password: hashedPassword,
//         });
//         return res.status(201).json({
//             message: 'Account created successfully.',
//             success: true,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Server error');
//     }
// };

// // Forgot Password
// export const forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Create a reset token
//         const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

//         // Create a reset URL
//         const resetURL = `http://localhost:3000/reset-password/${token}`;

//         // Send email with Nodemailer
//         const transporter = nodemailer.createTransport({
//             service: 'Gmail',
//             auth: {
//                 user: 'your_email@gmail.com', // Your email
//                 pass: 'your_password', // Your email password
//             },
//         });

//         const mailOptions = {
//             from: 'your_email@gmail.com',
//             to: user.email,
//             subject: 'Password Reset',
//             text: `Click on the following link to reset your password: ${resetURL}`,
//         };

//         await transporter.sendMail(mailOptions);

//         return res.json({ message: 'Password reset email sent!' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error');
//     }
// };

// // Reset Password Route
// export const resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;

//     try {
//         // Verify token
//         const decoded = jwt.verify(token, JWT_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return res.status(404).json({ message: 'Invalid token or user not found' });
//         }

//         // Hash the new password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Update user's password in the database
//         user.password = hashedPassword;
//         await user.save();

//         return res.json({ message: 'Password has been reset successfully' });
//     } catch (err) {
//         console.error(err);
//         return res.status(400).json({ message: 'Invalid or expired token' });
//     }
// };

// // Login user
// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(401).json({
//                 message: 'Something is missing, please check!',
//                 success: false,
//             });
//         }
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({
//                 message: 'Incorrect email or password',
//                 success: false,
//             });
//         }
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if (!isPasswordMatch) {
//             return res.status(401).json({
//                 message: 'Incorrect email or password',
//                 success: false,
//             });
//         }

//         const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

//         // Populate each post if in the posts array
//         const populatedPosts = await Promise.all(
//             user.posts.map(async (postId) => {
//                 const post = await Post.findById(postId);
//                 if (post.author.equals(user._id)) {
//                     return post;
//                 }
//                 return null;
//             })
//         );

//         user = {
//             _id: user._id,
//             username: user.username,
//             email: user.email,
//             profilePicture: user.profilePicture,
//             bio: user.bio,
//             followers: user.followers,
//             following: user.following,
//             posts: populatedPosts,
//         };

//         return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
//             message: `Welcome back ${user.username}`,
//             success: true,
//             user,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Server error');
//     }
// };

// // Edit Profile
// export const editProfile = async (req, res) => {
//     try {
//         const userId = req.id;
//         const { bio, gender } = req.body;
//         const profilePicture = req.file;
//         let cloudResponse;

//         if (profilePicture) {
//             const fileUri = getDataUri(profilePicture);
//             cloudResponse = await cloudinary.uploader.upload(fileUri);
//         }

//         const user = await User.findById(userId).select('-password');
//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found.',
//                 success: false,
//             });
//         }
//         if (bio) user.bio = bio;
//         if (gender) user.gender = gender;
//         if (profilePicture) user.profilePicture = cloudResponse.secure_url;

//         await user.save();

//         return res.status(200).json({
//             message: 'Profile updated.',
//             success: true,
//             user,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Server error');
//     }
// };

// // Follow or Unfollow User
// export const followOrUnfollow = async (req, res) => {
//     try {
//         const followKrneWala = req.id; // patel
//         const jiskoFollowKrunga = req.params.id; // shivani
//         if (followKrneWala === jiskoFollowKrunga) {
//             return res.status(400).json({
//                 message: 'You cannot follow/unfollow yourself',
//                 success: false,
//             });
//         }

//         const user = await User.findById(followKrneWala);
//         const targetUser = await User.findById(jiskoFollowKrunga);

//         if (!user || !targetUser) {
//             return res.status(400).json({
//                 message: 'User not found',
//                 success: false,
//             });
//         }
//         // Check if already following
//         const isFollowing = user.following.includes(jiskoFollowKrunga);
//         if (isFollowing) {
//             // Unfollow logic
//             await Promise.all([
//                 User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
//                 User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
//             ]);
//             return res.status(200).json({ message: 'Unfollowed successfully', success: true });
//         } else {
//             // Follow logic
//             await Promise.all([
//                 User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
//                 User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
//             ]);
//             return res.status(200).json({ message: 'Followed successfully', success: true });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Server error');
//     }
// };
