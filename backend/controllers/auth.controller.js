import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

import crypto from "crypto";
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			username,
			email,
			password: hashedPassword
		});

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				username: newUser.username,
				email: newUser.email,
				profileImg: newUser.profileImg,
				leaderboardScore: newUser.leaderboardScore,
                rank: newUser.rank,
                climbedRoutes: newUser.climbedRoutes,
				projects: newUser.projects,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			profileImg: user.profileImg,
			leaderboardScore: user.leaderboardScore,
			rank: user.rank,
			climbedRoutes: user.climbedRoutes,
			projects: user.projects,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

//get athenticated user to use it later
export const getMe = async (req, res) => {
	try {
		// Add .populate("climbedRoutes") to fetch the full Route objects
		const user = await User.findById(req.user._id).select("-password")
			.populate("climbedRoutes") // Add this line
			.populate("projects"); // Add this line

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ error: "User with this email does not exist" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString("hex");
		const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

		// Save reset token to user model
		user.resetToken = hashedToken;
		user.resetTokenExpire = Date.now() + 30 * 60 * 1000; // Token expires in 10 min
		await user.save();

		// Send reset email
		const resetUrl = `https://csu-climb.onrender.com/reset-password/${resetToken}`; // Update with your frontend URL

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: `"CSU Climb" <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject: "Password Reset Request",
			html: `
				<p>You have requested to reset your password.</p>
				<p>Click the link below to reset your password. This link will expire in 30 minutes.</p>
				<a href="${resetUrl}">${resetUrl}</a>
				<p>If you did not request this, please ignore this email.</p>
			`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "Reset password link sent to email" });
	} catch (error) {
		console.log("Error in forgotPassword controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;  // Get token from URL params
        const { password } = req.body; // Get the new password from the request body

        // Hash the received token to compare with the stored hashed token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find the user by the hashed token and check if the token has expired
        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpire: { $gt: Date.now() },  // Token must not be expired
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Hash the new password before saving it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear the reset token fields after a successful password reset
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};