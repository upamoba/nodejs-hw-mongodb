import jwt from 'jsonwebtoken';

const { JWT_RESET_SECRET = 'dev', JWT_RESET_TTL = '1h' } = process.env;
export function signResetToken(payload) {
    return jwt.sign(payload, JWT_RESET_SECRET, { expiresIn: JWT_RESET_TTL });
    }
export function verifyResetToken(token) {
    return jwt.verify(token, JWT_RESET_SECRET);
    }

