import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export async function authenticate(req, _res, next) {
  try {
    const header = req.get('Authorization') || req.get('authorization') || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(new createHttpError.Unauthorized('Not authorized'));
    }
    const session = await Session.findOne({ accessToken: token });
    if (!session || session.accessTokenValidUntil < new Date) {
      return next(new createHttpError.Unauthorized('Access token has expired'));

    }
const user = await User.findById(session.userId).lean();
    if (!user) {
      return next(new createHttpError.Unauthorized('User not found'));
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}
