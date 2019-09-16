import * as Yup from 'yup';

import Notification from '../schemas/Notification';
import User from '../models/User';

/**
 * Provider's notifications controller
 * @author Leonardo Otoni
 */
class NotificationController {
  /**
   * List all notifications from a Provider user authenticated.
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ message: 'User is not a valid provider.' });
    }

    const userNotifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(userNotifications);
  }

  /**
   * Set a notification as read
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    const validationSchema = Yup.object().shape({
      id: Yup.string().required(),
    });

    try {
      await validationSchema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ message: error.errors });
    }

    const notification = await Notification.findByIdAndUpdate(
      req.body.id,
      { read: true },
      { new: true } // forces Mongoose to return an updated instance
    );

    return res.json(notification);
  }
}

export default new NotificationController();
