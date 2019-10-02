import * as Yup from 'yup';
import { isAfter, isEqual, format } from 'date-fns';
import { Op } from 'sequelize';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

import User from '../models/User';

// import Mail from '../../services/Mail';
import SubscriptionMail from '../jobs/SubscriptionMail'; // Job
import Queue from '../../services/Queue'; // Queue Manager

/**
 * Manage all User's Meetup subscriptions.
 * @author Leonardo OToni
 */
class SubscriptionController {
  /**
   * List all User's subscriptions in Meetups that do not occurred yet.
   * The result set will be ordered by the the closest dates.
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async index(req, res) {
    const subscriptions = await Subscription.findAndCountAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          attributes: ['id', 'title', 'location', 'timestamp'],
        },
      ],
      order: [[{ model: Meetup }, 'timestamp', 'ASC']],
      offset: req.offset,
      limit: req.limit,
    });
    return res.json(subscriptions);
  }

  /**
   * Suscribe the Logged User in a valid (not occurred) Meetup.
   * Only non Meetup Organizers can subscribe into a Meetup.
   * The User cannot be insert twince for the same Meetup.
   * The User cannot be subscribed in a Meetup if him already be enrolled in
   * a different one occurring in the same date/time.
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const { userId: user_id } = req;
    const { meetup_id } = req.body;
    const meetup = await Meetup.findOne({
      where: {
        id: meetup_id,
      },
      attributes: ['id', 'user_id', 'timestamp'],
      include: [{ model: User, attributes: ['name', 'email'], required: true }],
    });

    if (!meetup) {
      return res.status(400).json({ message: 'Invalid Meetup id' });
    }

    // Check if the logged user is the Meetup Organizer
    if (meetup.user_id === user_id) {
      return res.status(400).json({
        message:
          'User cannot be subscribed on Meetup that he/she is the Organizer.',
      });
    }

    // Can only subscribe on valid Meetups (not occurred yet)
    if (isAfter(new Date(), meetup.timestamp)) {
      return res.status(400).json({
        message: 'You cannot subscribe on a Meetup that already occurred.',
      });
    }

    // Get all User's subsctiptions that did not occurred yet
    const userSubscriptions = await Subscription.findAll({
      where: {
        user_id,
      },
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          attributes: ['id', 'timestamp'],
          where: {
            timestamp: {
              [Op.gt]: new Date(),
            },
          },
        },
      ],
    });

    // Verififies if the User is already subscribed in this event
    const alreadySubscribed = userSubscriptions.find(
      s => s.Meetup.id === meetup.id
    );

    if (alreadySubscribed) {
      return res
        .status(400)
        .json({ message: 'User is already subscribed on this Meetup.' });
    }

    // Check if user has time conflict with a
    const hasScheduleConflict = userSubscriptions.find(s => {
      return isEqual(s.meetup.timestamp, meetup.timestamp);
    });

    if (hasScheduleConflict) {
      return res.status(400).json({
        message:
          'User is already subscribed in other Meetup having the same date and time.',
      });
    }

    const newSubs = await Subscription.create({
      meetup_id,
      user_id,
    });

    const subscription = {
      name: 'Leo',
      email: 'leonardootoni@gmail.com',
      user_id,
      createdAt: newSubs.createdAt,
    };

    Queue.add(
      SubscriptionMail.key,
      { subscription } // data object used by Job's handle method
    );

    const { id } = newSubs;
    return res.json({ id, meetup_id, user_id });
  }

  /**
   * Remove User's subscription from a non occurred Meetup.
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async delete(req, res) {
    return res.json('ok');
  }
}

export default new SubscriptionController();
