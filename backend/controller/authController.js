import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.statusCode = 409;
      return next(error);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email: email,
      password: hashPassword,
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Login credentials does not exists');
      error.statusCode = 401;
      return next(error);
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      const error = new Error('Login credentials does not exists');
      error.statusCode = 401;
      return next(error);
    }
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: '15m',
    });
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export { getMe, registerUser, loginUser };
