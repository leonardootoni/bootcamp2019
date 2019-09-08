import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // Handle random bytes in the file (16 bytes).
      crypto.randomBytes(16, (err, res) => {
        if (err) {
          return cb(err);
        }

        /**
         * No errors occurred. Generate a
         * Null: The first parameter is for errors. Because there is no error, set null.
         * res.toString('hex'): Get the resp from crypto and generate a hexadecimal string
         */
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
