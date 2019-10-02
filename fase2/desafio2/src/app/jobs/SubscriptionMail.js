import { format, parseISO } from 'date-fns';
import Mail from '../../services/Mail';

/**
 * Subscription Mail Job
 * Job to send an email to a Meetup Organizer when an Antendant do a subscription.
 * @author Leonardo Otoni
 */
class SubscriptionMail {
  /**
   * Provides the Official Job Name
   */
  get key() {
    return 'SubscriptionMail';
  }

  /**
   * Define the task to perform when the Cancellation Mail job runs.
   * @param {Object} data - Appointment object having provider name, email, appointment date and user name
   */
  async handle({ data }) {
    const { subscription } = data;
    await Mail.sendMail({
      to: `${subscription.name} <${subscription.email}>`,
      subject: 'New Subscription made',
      template: 'subscription', // handlebars template
      context: {
        organizer: subscription.name,
        user: subscription.user_id,
        date: format(parseISO(subscription.createdAt), 'yyyy-MMM-dd, hh:mm a'),
      },
    });
  }
}

export default new SubscriptionMail();
