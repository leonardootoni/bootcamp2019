import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';

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
    const userAppointments = await Appointment.findAll({
      where: { user_id, canceled_at: null },
    });
    return res.status(200).json({ appointments: userAppointments });
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
      provider_id: Yup.number().required(),
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

    return res.json(appointment);
  }
}

export default new AppointmentController();
