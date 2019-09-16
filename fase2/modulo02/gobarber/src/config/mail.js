/**
 * Application Mail Service config for mailtrap.io
 * @author Leonardo Otoni
 */
export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'cb1aea7e4f1c76',
    pass: 'fe35eb173bcd7f',
  },
  secure: false,
  default: {
    from: 'GoBarber Team <noreply@gobarber.com>',
  },
};
