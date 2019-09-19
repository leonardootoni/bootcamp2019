import { format, parseISO } from 'date-fns';
import Mail from '../../services/Mail';

/**
 * Cancelation Mail Job
 * Job to send an email to a provider when a customer cancel an appointment.
 * @author Leonardo Otoni
 */
class CancellationMail {
  /**
   * Provides the Official Job Name
   */
  get key() {
    return 'CancellationMail';
  }

  /**
   * Define the task to perform when the Cancellation Mail job runs.
   * @param {Object} data - Appointment object having provider name, email, appointment date and user name
   */
  async handle({ data }) {
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
