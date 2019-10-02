import * as Yup from 'yup';
import { Op } from 'sequelize';
import {
  isAfter,
  parseISO,
  setMilliseconds,
  setSeconds,
  setMinutes,
  startOfDay,
  endOfDay,
} from 'date-fns';

import User from '../models/User';
import File from '../models/File';
import Meetup from '../models/Meetup';

/**
 * Controller to manage User's Meetups
 * @author: Leonardo Otoni
 */
class MeetupController {
  constructor() {
    // bind store method to allow it to invoke roundMeetupTime()
    this.store = this.store.bind(this);
  }

  /**
   * List all logged user's Meetups.
   * It also gets the file Name and url to download.
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async index(req, res) {
    const schema = Yup.object().shape({
      page: Yup.number()
        .required()
        .min(1),
      date: Yup.date().required(),
    });

    try {
      await schema.validate(req.query, { abortEarly: false });
    } catch (error) {
      return res.status(400).json(error.errors);
    }

    const { userId: user_id, limit, offset } = req;
    const date = parseISO(req.query.date);
    const result = await Meetup.findAndCountAll({
      where: {
        user_id,
        timestamp: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
      attributes: ['id', 'title', 'location', 'timestamp'],
      include: [
        { model: File, as: 'banner', attributes: ['name', 'path', 'url'] },
      ],
      limit,
      offset,
    });

    return res.json(result);
  }

  /**
   * Create Meetups
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      timestamp: Yup.date()
        .min(new Date())
        .required(),
      file_id: Yup.number().required(),
      user_id: Yup.number().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json(error.errors);
    }

    const {
      title,
      description,
      location,
      timestamp,
      file_id,
      user_id,
    } = req.body;

    // Check if a given user exists.
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ message: 'Informed user does not exist.' });
    }

    /**
     * Checks if informed meetup dateTime already exists in the database for the
     * given user
     */
    const eventDate = await this.roundMeetupTime(timestamp);
    const existMeetup = await Meetup.findOne({
      where: {
        user_id,
        timestamp: eventDate,
      },
      attributes: ['id'],
    });

    if (existMeetup) {
      return res.status(400).json({
        message: 'User already has an event on the specified date/time',
      });
    }
    const meetup = await Meetup.create({
      title,
      description,
      location,
      timestamp: eventDate,
      file_id,
      user_id,
    });
    return res.json(meetup);
  }

  /**
   * For a given Date, It rounds the timestamp to an rounded hour, ignoring data
   * regards to minutes, seconds and miliseconds.
   * Ex: 2019-12-25T09:33:21:123 becomes 2019-12-25T09:00:00:000
   * @param {String} meetupDate - The Meetup event timestamp
   * @returns {Date}
   */
  async roundMeetupTime(meetupDate) {
    const newDate = parseISO(meetupDate);
    return setMinutes(setSeconds(setMilliseconds(newDate, 0), 0), 0);
  }

  /**
   * Update a User's Meetup.
   * A Meetup can only be updated by its owner
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string().required(),
      timestamp: Yup.date()
        .required()
        .min(new Date()),
      description: Yup.string().required(),
      location: Yup.string().required(),
      user_id: Yup.number().required(),
      file_id: Yup.number().required(),
    });

    try {
      await schema.validate(
        { ...req.params, ...req.body },
        { abortEarly: false }
      );
    } catch (error) {
      return res.status(400).json(error.errors);
    }

    const { id } = req.params;
    const { user_id } = req.body;

    const meetup = await Meetup.findByPk(id, {
      where: {
        user_id,
      },
    });

    if (!meetup) {
      return res
        .status(400)
        .json('Invalid Meetup id or Logged user is not the Meetup owner.');
    }

    await meetup.update(req.body);
    return res.json({ message: 'Meetup successfully updated.' });
  }

  /**
   * Delete a Logged User's Meetup.
   * Only not occurred meetups are able to be delete.
   * @param {Object} req - Request
   * @param {Object} res - Request
   */
  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    try {
      await schema.validate(req.params);
    } catch (error) {
      return res.status(400).json(error);
    }

    const { userId: user_id } = req;
    const { id } = req.params;
    const meetup = await Meetup.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!meetup) {
      return res
        .status(400)
        .json({ message: 'Invalid meetup for the authenticated user.' });
    }

    if (isAfter(new Date(), meetup.timestamp)) {
      return res
        .status(400)
        .json({ message: 'An occurred Meetup cannot be delete.' });
    }
    await meetup.destroy();
    return res.json({ message: 'Meetup successfully deleted' });
  }
}

export default new MeetupController();
