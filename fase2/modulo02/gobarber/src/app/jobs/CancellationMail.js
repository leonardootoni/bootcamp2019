import { format, parseISO } from 'date-fns';
import Mail from '../../services/Mail';

/**
 * Cancelation Mail Job
 * @author Leonardo Otoni
 */
class CancellationMail {
  // Provides a unique key for this job. Its a Queue name.
  get key() {
    return 'CancellationMail';
  }

  /**
   * Define the task to perform when the Cancellation Mail job runs.
   * @param {Appointment object having provider name, email, appointment date and user name} data
   */
  async handle({ data }) {
    console.log('Queue executed!');
    const { appointment } = data;
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Appointment Cancelled',
      template: 'cancellation', // handlebars template
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date), 'yyyy-MMM-dd, hh:mm a'),
      },
    });
  }
}

export default new CancellationMail();
