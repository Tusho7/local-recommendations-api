import User from "../models/User.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4, v4 } from "uuid";
import { sendVerificationEmail } from "../utils/emailVerification.js";

const generateUniqueCode = () => {
  return uuidv4();
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
