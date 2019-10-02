/**
 * Step 1 - create a nodemailer config file config/mail.js
 * @author Leonardo Otoni
 */
export default {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: false,
  default: {
    from: 'GoBarber Team <noreply@gobarber.com>',
  },
};
