import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Helper to set the JWT as an httpOnly cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email and password" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }

    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarEmoji: user.avatarEmoji,
      theme: user.theme,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }


    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarEmoji: user.avatarEmoji,
      theme: user.theme,
      streak: user.streak,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (avatar emoji, theme)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatarEmoji = req.body.avatarEmoji || user.avatarEmoji;
    user.theme = req.body.theme || user.theme;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatarEmoji: updatedUser.avatarEmoji,
      theme: updatedUser.theme,
    });
  } catch (error) {
    next(error);
  }
};
