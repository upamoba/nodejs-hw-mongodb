import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export async function authenticate(req, _res, next) {
  const hdr = req.get('Authorization') || '';
  const [type, token] = hdr.split(' ');
  if (type !== 'Bearer' || !token) throw new createHttpError.Unauthorized('Not authorized');

  const session = await Session.findOne({ accessToken: token });
  if (!session || session.accessTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Access token has expired');
  }

  const user = await User.findById(session.userId).lean();
  if (!user) throw new createHttpError.Unauthorized('Not authorized');

  req.user = user;
  next();
}


