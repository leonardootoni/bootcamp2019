import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../services/Queue';

/**
 * Class to handle all Application Appointments
 * @author Leonardo Otoni
 */
class AppointmentController {
  /**
   * List all Appointments created by the authenticated user.
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const user_id = req.userId;
    const appointments = await Appointment.findAll({
      where: { user_id, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: req.limit,
      offset: req.offset,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.status(200).json({ appointments });
  }

  /**
   * Create an appointment to a authenticated user.
   * All appointments will be saved considering the Full Hour of a valid date.
   * Minutes and seconds will be not considered when do an appointment. Only non
   * provider users can do appointments to provider users. The system will reject
   * any duplicated appointment for a provider having the same date-time.
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number()
        .required()
        .notOneOf(
          [req.userId],
          'A user cannot schedule an appointment to himself/herself.'
        ),
      date: Yup.date().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ message: error.errors });
    }

    // Check if the provider_id is in fact, a real provider in the db.
    const { provider_id, date } = req.body;
    const provider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!provider) {
      return res
        .status(401)
        .json('You can only create appointments with providers.');
    }

    /**
     * Will consider only the part "hour" of a valid date, ignoring the minutes
     * part.
     * parseISO: Will transform value in a JS Date object
     * startofHour: Consider only the hour data and ignores minutes, seconds,
     * etc in a date
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ message: 'Past appointment dates are not permitted.' });
    }

    /**
     * Check date availabity from a provider
     */
    const providerHasAppointments = await Appointment.findOne({
      where: { date: hourStart, provider_id, canceled_at: null },
    });

    if (providerHasAppointments) {
      return res.status(400).json({
        message: 'Provider already has an appointment for this date.',
      });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /**
     * Notify an appointment to provider
     */
    const user = await User.findOne({
      where: { id: req.userId },
      attributes: ['name'],
    });

    const formattedDate = format(hourStart, 'yyyy-MMM-dd, hh:mm a');
    await Notification.create({
      content: `New schedule from ${user.name} to ${formattedDate} registred.`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  /**
   * Cancel an User's appointment that it is two or more hours from the
   * specified schedule date/time. The Appointment can only be canceld by its
   * owner.
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req, res) {
    const validationSchema = Yup.object().shape({
      id: Yup.number().required(),
    });

    try {
      await validationSchema.validate(req.params);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });
    if (!appointment) {
      return res.status(400).json({ message: 'Invalid Appointment code.' });
    }

    if (req.userId !== appointment.user_id) {
      return res.status(401).json({
        message:
          'Unauthorized: Appointment can only be cancelled by its owner.',
      });
    }

    /**
     * Appointment can be cancelled only with 2 or more hours difference from
     * the appointment schedule time.
     */
    const datetimeLimit = subHours(appointment.date, 2);
    if (isBefore(datetimeLimit, new Date())) {
      return res.status(400).json({
        message:
          'Appointment cannot be cancelled having more than 2 hours to occur.',
      });
    }

    appointment.canceled_at = new Date();
    await appointment.save();
    Queue.add(CancellationMail.key, {
      appointment,
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
