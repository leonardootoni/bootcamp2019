/**
 * Application Mail Service config for mailtrap.io
 * @author Leonardo Otoni
 */
export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: false,
  default: {
    from: 'GoBarber Team <noreply@gobarber.com>',
  },
};
