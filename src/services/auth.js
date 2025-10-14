import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { mailer, sendMail } from '../utils/emailTransporter.js';
import { createResetToken, verifyResetToken } from '../utils/jwtReset.js';

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

  const token = createResetToken({ email });
  const url = `${process.env.APP_DOMAIN}/reset-password?token=${encodeURIComponent(token)}`;

try {
    await mailer.sendMail({
        from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click to reset: <a href="${url}">${url}</a></p><p>Valid for 5 minutes.</p>`,
    });
  } catch  {
    throw new createHttpError(500, 'Failed to send email,please try again later');
  }
}



export async function resetPasswordService({ token, password }) {

  let payload;
  try {

    payload = verifyResetToken(token);
  } catch{
    throw new createHttpError.Unauthorized('Invalid or expired token');
  }
  const user = await User.findOne({ email: payload.email });
  if (!user) throw new createHttpError.NotFound('User not found');

  const hash = await bcrypt.hash(password, 10);
  user.password = hash;
  await user.save();

  await Session.deleteMany({ userId: user._id });
}


export async function loginOrRegister(email, name) {
  let user = await User.findOne({ email });

  if (!user) {
    const password = await bcrypt.hash(
      crypto.randomBytes(30).toString('base64'),
      10
    );
    user = await User.create({ name, email, password });
  }

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

  return session; }
