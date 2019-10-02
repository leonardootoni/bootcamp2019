import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

import mailConfig from '../config/mail';

/**
 * Service Email Class
 * @author Leonardo Otoni
 */
class Mail {
  constructor() {
    // configuration file (step1)
    const { host, port, secure, auth } = mailConfig;

    // basic config for nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  /**
   * Set template location and view engine to load and process html templates.
   */
  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          // express-handlebars config
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs', // config for nodemailer-express-handlebars
      })
    );
  }

  /**
   * Send a message to a SMTP server
   * @param {*} message
   */
  async sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
