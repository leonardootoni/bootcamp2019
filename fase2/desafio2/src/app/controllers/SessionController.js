import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import TokenConfig from '../../config/authConfig';
import User from '../models/User';

/**
 * Controller to handle user authentication
 * @author Leonardo Otoni
 */
class SessionController {
  /**
   * Authenticate an User and give back a Token and basic user data.
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async store(req, res) {
    const loginSchema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    try {
      await loginSchema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ message: error.errors });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user or password.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: 'Invalid user or password.' });
    }

    // User has valid credentials. Generate token JWT
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, TokenConfig.secret, {
        expiresIn: TokenConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
