import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  let email;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    email = payload.email;
  } catch (error) {
    console.error(error);
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
