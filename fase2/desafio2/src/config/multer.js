/**
 * Config Multer File Storage for Upload file route.
 * @author Leonardo Otoni
 */
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      /**
       * Handle random bytes in the file (16 bytes).
       * It forces to generate 16 random hexadecimal 16 bytes number and use it
       * as a new file name in order to avoid files having special characters.
       *  */
      crypto.randomBytes(16, (err, res) => {
        if (err) {
          return cb(err);
        }

        /**
         * No errors occurred. Generate a string from hexadecimal
         * Null: The first parameter is for errors. Because there is no error, set null.
         * res.toString('hex'): Get the resp from crypto and generate a hexadecimal string
         * extname: get the extension file name
         */
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
