import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createAdmin = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userExists = await Admin.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "ელ-ფოსტა გამოყენებულია." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await newAdmin.save();

    res.status(201).json({ message: "ადმინი შეიქმნა წარმატებით", newAdmin });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).json({ message: "ადმინი არ არსებობს" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "არასწორი პაროლი" });
    }

    const token = jwt.sign(
      { email: admin.email, id: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    res.status(200).json({ message: "წარმატებით შესვლა" });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    res.cookie("adminToken", "", {
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

export const getAdmin = async (req, res) => {
  try {
    const adminId = req.admin?.id;
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error getting admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCredentials = async (req, res) => {
  const { adminId } = req.params;
  const { currentPassword, newPassword, newEmail } = req.body;

  try {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (newEmail) {
      admin.email = newEmail;
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(
        String(currentPassword),
        String(admin.password)
      );
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "არასწორი ამჟამინდელი პაროლი." });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
    }
    await admin.save();

    return res.status(200).json({ message: "წარმატებით განახლდა.", admin });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};
