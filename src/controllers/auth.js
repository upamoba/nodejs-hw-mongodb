import { sendMail } from '../utils/emailTransporter.js';
import { User } from '../models/user.js';

import { getOAuthURL,validateCode } from "../utils/googleOAuth.js";
import { registerUser, loginUser, refreshSession, logoutUser,sendResetEmailService, resetPasswordService,loginOrRegister} from '../services/auth.js';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const baseCookie = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
};
if (process.env.NODE_ENV === 'production') baseCookie.secure = true;

export async function registerController(req, res) {
  const user = await registerUser(req.body);
  res.status(201).json({ status: 201, message: 'Successfully registered a user!', data: user });
}

export async function loginController(req, res) {
  const { accessToken, refreshToken } = await loginUser(req.body);
  res.cookie('refreshToken', refreshToken,{ ...baseCookie, maxAge: COOKIE_MAX_AGE });
  res.status(200).json({ status: 200, message: 'Successfully logged in an user!', data: { accessToken } });
}

export async function refreshController(req, res) {
  console.log('raw cookie:', req.headers.cookie);
  console.log('parsed cookies:', req.cookies);
  const refreshFromCookie = req.cookies?.refreshToken;
  const { accessToken, refreshToken } = await refreshSession(refreshFromCookie);
  res.cookie('refreshToken', refreshToken, { ...baseCookie, maxAge: COOKIE_MAX_AGE });
  res.status(200).json({ status: 200, message: 'Successfully refreshed a session!', data: { accessToken } });
}

export async function logoutController(req, res) {
  const refreshFromCookie = req.cookies?.refreshToken;
  await logoutUser( refreshFromCookie);
  res.clearCookie('refreshToken', baseCookie);
  res.status(204).end();
}

export async function sendResetEmailController(req, res) {

  await sendResetEmailService(req.body.email);
  res.status(200).json({ status: 200, message: 'Reset password email has been successfully sent!', data: {} });
}

export async function resetPasswordController(req, res) {
  const { token, password } = req.body;
  await resetPasswordService({ token, password });
  res.status(200).json({ status: 200, message: 'Password has been reset successfully!', data: {} });
};






export  function getOAuthURLController(req,res){
const url = getOAuthURL();

  res.json({
status:200,
message: "Successfully get OAuth url",
data: {
  oauth_url: url,
}
  });
}

export async function confirmOAuthController(req, res, next) {
  try {

    const code = req.query.code || req.body?.code;
    if (!code) {
      return res.status(400).json({ status: 400, message: "Missing OAuth code" });
    }

    const { ticket} = await validateCode(code);


    const payload = ticket.getPayload?.()  || ticket.payload;
    const email = payload.email;
    const name = payload.name || payload.given_name || "Google User";

   const session = await loginOrRegister(email, name);
console.log('code length:', String(req.query.code || '').length);

    res.cookie("sessionId", String(session._id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      expires: session.refreshTokenValidUntil,
      ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),

    });

    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      expires: session.refreshTokenValidUntil,
      ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
    });

    return res.json({
      status: 200,
      message: "Login via OAuth successfully",
      data: { accessToken: session.accessToken },
    });
  } catch (e) {
    next(e);
  }
}
