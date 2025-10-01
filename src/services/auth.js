import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
// import {
//   createAccessToken,
//   createRefreshToken,
//   verifyRefresh,
// } from '../utils/token.js';
const token = (n = 30) => crypto.randomBytes(n).toString('base64url');
const ACCESS_TTL = 15 * 60 * 1000;
const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000;
export async function registerUser({ name, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new createHttpError.Conflict('Email in use');
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });

  const { password: _omit, ...safeUser } = user.toObject();
  return safeUser;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new  createHttpError.Unauthorized('Email or password is incorrect');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new createHttpError.Unauthorized('Email or password is incorrect');


  await Session.deleteMany({ userId: user._id });

  const accessToken = token();
  const refreshToken = token();

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TTL),
  });

  return {  accessToken, refreshToken,sessionId: String(session._id),userId: String(user._id)  };
}

export async function refreshSession({ refreshFromCookie}) {
  if (!refreshFromCookie) throw new createHttpError.Unauthorized('Refresh token is missing');

 const prev = await Session.findOne({ refreshToken: refreshFromCookie });
  if (!prev || prev.refreshTokenValidUntil < new Date)
    {throw new createHttpError.Unauthorized('Invalid refresh token');
  }

  await Session.deleteOne({ _id: prev._id });



  const accessToken = token();
  const refreshToken = token();
await Session.create({
    userId: prev.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TTL),
  });

  return { accessToken, refreshToken };
}

<<<<<<< Updated upstream
export async function logoutUser({ refreshFromCookie }) {
=======
export async function logoutUser(refreshFromCookie ) {
>>>>>>> Stashed changes
  if (!refreshFromCookie) return;
  await Session.deleteOne({ refreshToken: refreshFromCookie });
}
