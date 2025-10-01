
import { registerUser, loginUser, refreshSession, logoutUser } from '../services/auth.js';

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export async function registerController(req, res) {
  const user = await registerUser(req.body);
  res.status(201).json({ status: 201, message: 'Successfully registered a user!', data: user });
}

export async function loginController(req, res) {
  const { accessToken, refreshToken } = await loginUser(req.body);
  res.cookie('refreshToken', refreshToken, cookieOpts);
  res.status(200).json({ status: 200, message: 'Successfully logged in an user!', data: { accessToken } });
}

export async function refreshController(req, res) {
  const rt = req.cookies?.refreshToken;
  const { accessToken, refreshToken } = await refreshSession(rt);
  res.cookie('refreshToken', refreshToken, cookieOpts);
  res.status(200).json({ status: 200, message: 'Successfully refreshed a session!', data: { accessToken } });
}

export async function logoutController(req, res) {
  const rt = req.cookies?.refreshToken;
  await logoutUser(rt);
  res.clearCookie('refreshToken', cookieOpts);
  res.status(204).end();
}

