import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, env('JWT_SECRET'), { expiresIn: '7d' });

  if (res) {
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      httpOnly: true,
      sameSite: "strict",
      secure: env('NODE_ENV') !== 'development',
    });
  }

  return token;
};
