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

    // Short-lived access token
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: '15m',
    });

    // Long-lived refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: '1d',
      },
    );

    // Store refresh token in an HttpOnly cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000,
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

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required',
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

    const token = jwt.sign({ userId: decoded.userId }, env.JWT_SECRET, {
      expiresIn: '15m',
    });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
};

export { getMe, registerUser, loginUser, refreshAccessToken };
