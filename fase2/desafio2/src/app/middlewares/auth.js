import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/authConfig';

/**
 * Class responsible to verify the User Authentication Token before
 * access any protected route.
 * @author Leonardo Otoni
 */
class SessionChecker {
  async checkToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    /**
     * It is expected a token followed by Bearer meta in the header
     */
    const [, token] = authHeader.split(' ');
    try {
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);

      /**
       * Token was successfully decoded.
       * Extract the userId from the token and set it in the request
       */
      req.userId = decoded.id;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
  }
}

export default new SessionChecker();
