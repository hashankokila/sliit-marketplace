import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password, campus } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const domain = email.split("@")[1]?.toLowerCase();
    if (domain !== process.env.ALLOWED_EMAIL_DOMAIN)
      return res.status(400).json({ message: "Only SLIIT student emails are allowed" });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    // Raw token goes in the email; only its hash is stored in the DB
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await User.create({
      name,
      email,
      password: hashed,
      campus,
      verifyToken: hashedToken,
      verifyTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const link = `${process.env.CLIENT_URL}/verify/${rawToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your SLIIT Marketplace account",
      html: `<p>Click to verify your account: <a href="${link}">${link}</a></p>`,
      devLink: link,
    });

    res.status(201).json({ message: "Registered. Check your email to verify." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired link" });

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    res.json({ message: "Email verified. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email first" });

    res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, campus: user.campus },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};