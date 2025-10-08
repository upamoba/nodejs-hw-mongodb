import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { sendMail } from '../utils/emailTransporter.js';
import { signResetToken, verifyResetToken } from '../utils/jwtReset.js';
;

// const { APP_DOMAIN = 'http://localhost:3000' } = process.env;
const token = (n = 30) => crypto.randomBytes(n).toString('base64url');
const ACCESS_TTL = 15 * 60 * 1000;
const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000;
export async function registerUser({ name, email, password }) {
  const normalizedEmail = String(email ?? '').trim().toLowerCase();
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    throw new createHttpError.Conflict('Email in use');
  }

  const hash = await bcrypt.hash(String(password ?? ''), 10);
  const user = await User.create({ name, email:normalizedEmail, password: hash });

  const { password: _omit, ...safeUser } = user.toObject();
  return safeUser;
}

export async function loginUser({ email, password }) {
  const normalizedEmail = String(email ?? '').trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) throw new  createHttpError.Unauthorized('Email or password is incorrect');

  const isMatch = await bcrypt.compare(String(password ?? ''), user.password);
  if (!isMatch) throw new createHttpError.Unauthorized('Email or password is incorrect');


  await Session.deleteMany({ userId: user._id });

  const accessToken = token();
  const refreshToken = token();

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TTL),
  });

  return {  accessToken, refreshToken  };
}

export async function refreshSession(refreshFromCookie) {
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

export async function logoutUser( refreshFromCookie ) {
  if (!refreshFromCookie) return;
  await Session.deleteOne({ refreshToken: refreshFromCookie });
}

export async function sendResetEmailService(email) {
  const user = await User.findOne({ email });
  if (!user) throw new createHttpError.NotFound('User with this email not found');

  const token = signResetToken({ email: user.email });

  const link = `${APP_DOMAIN}/reset-password?token=${encodeURIComponent(token)}`;
  const html = `
  <p>Hi, ${user.name}</p>
  <p>To reset your password, please click the link below:</p>
  <p><a href="${link}">${link}</a></p>
`;
try {
    await sendMail({
      to: user.email,
      subject: 'Password Reset',
      html,
    });
  } catch (error) {
    throw new createHttpError(500, 'Failed to send email');
  }
}

function normalizeToken(input) {
  if (typeof input === 'string') {

    const m = input.match(/[?&]token=([^&]+)/);
    return decodeURIComponent(m ? m[1] : input).trim();
  }
  if (input && typeof input === 'object' && typeof input.token === 'string') {
   return input.token.trim();
  }
  throw new createHttpError.BadRequest('Token must be a string');
}

export async function resetPasswordService({ token, password }) {
if (typeof password !== 'string' || password.length < 8) {
throw new createHttpError.BadRequest('Password is required and must be at least 8 chars');
  }
  let payload;
  try {
     const normalized = normalizeToken(token);
    payload = verifyResetToken(normalized);
  } catch(error){
    console.log('verifyResetToken failed:', error.name, error.message);
    throw new createHttpError.Unauthorized('Invalid or expired token');
  }
  const user = await User.findOne({ email: payload.email });
  if (!user) throw new createHttpError.NotFound('User not found');

  const hash = await bcrypt.hash(password, 10);
  user.password = hash;
  await user.save();

  await Session.deleteMany({ userId: user._id });
}

