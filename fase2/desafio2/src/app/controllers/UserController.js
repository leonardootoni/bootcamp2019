import * as Yup from 'yup';
import User from '../models/User';

/**
 * User Controller Handler
 * @author Leonardo Otoni
 */
class UserController {
  /**
   * Register a new user into the system
   */
  async store(req, res) {
    const userSchema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    try {
      await userSchema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ message: error.errors });
    }

    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create(req.body);
    const { id, name, email } = user;
    return res.json({ message: 'ok', user: { id, name, email } });
  }

  /**
   * Performs the user password update
   */
  async update(req, res) {
    const validationSchema = Yup.object().shape({
      userId: Yup.number()
        .integer()
        .required(),
      oldPassword: Yup.string().required(),
      password: Yup.string().required(),
      passwordConfirmation: Yup.string().oneOf(
        [Yup.ref('password')],
        'Password does not match.'
      ),
    });

    const { oldPassword, password, passwordConfirmation } = req.body;
    const userId = req.params.id;
    const userData = {
      userId,
      oldPassword,
      password,
      passwordConfirmation,
    };

    try {
      await validationSchema.validate(userData, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ message: error.errors });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: 'User does not exists.' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ message: 'Password does not match.' });
    }

    await user.update({ password });
    return res.json({ message: 'ok' });
  }
}

export default new UserController();
