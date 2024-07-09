import User from "../models/User.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  sendVerificationEmail,
  updateUserEmail,
  forgotPasswordEmail,
} from "../utils/emailVerification.js";
import jwt from "jsonwebtoken";

const generateUniqueCode = () => {
  return uuidv4();
};

const generateNewPssword = () => {
  return Math.random().toString(36).slice(-8);
};

export const createUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const { file } = req;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "ელ-ფოსტა გამოყენებულია." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = generateUniqueCode();

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      verificationCode,
      profilePicture: "profilePictures/" + file.originalname,
    });

    await newUser.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: "მომხმარებელი შეიქმნა წარმატებით" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ where: { email } });

    if (!user || !user.isVerified) {
      return res
        .status(401)
        .json({ message: "User not found or not verified" });
    }
    if (user.isBlocked)
      return res
        .status(401)
        .json({ message: "თქვენი მომხმარებელი დაბლოკილია." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
    });

    res.status(200).json({ id: user.id });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, first_name, last_name } = req.body;

  try {
    let user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const verificationCode = generateUniqueCode();
      await updateUserEmail(email, verificationCode);

      user.email = email;
      user.verificationCode = verificationCode;
      user.isVerified = false;
    } else if (email && email !== user.email && user.isVerified) {
      user.email = email;
    }

    if (first_name) {
      user.first_name = first_name;
    }

    if (last_name) {
      user.last_name = last_name;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyUser = async (req, res) => {
  const { email, verificationCode } = req.query;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (verificationCode !== user.verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPassword = generateNewPssword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    await forgotPasswordEmail(
      email,
      "Password reset",
      `Your new password is: ${newPassword}`
    );

    return res.status(200).json({
      message:
        "Password reset successfully. Check your email for the new password.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const totalUsers = async (req, res) => {
  try {
    const totalUsers = await User.count();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error getting total users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleBlockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    const action = user.isBlocked ? "blocked" : "unblocked";
    res.status(200).json({ message: `User ${action} successfully`, user });
  } catch (error) {
    console.error(`Error toggling user block status: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};
