
import { getEnvVariable } from './env.js';

const ACCESS_SECRET = getEnvVariable('JWT_ACCESS_SECRET');
const REFRESH_SECRET = getEnvVariable('JWT_REFRESH_SECRET');
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

export function createAccessToken(payload) {
  return (payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function createRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET);
}
