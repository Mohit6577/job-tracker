import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { success } from 'zod';

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new Error('Email already exists'));
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
      return next(new Error('Login credentials do not exists'));
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return next(new Error('Login credentials do not exists'));
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
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

export { registerUser, loginUser };
