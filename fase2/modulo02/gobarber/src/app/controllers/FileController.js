import File from '../models/File';

class FileController {
  /**
   * Save updloaded file data into the database.
   * It gets from multer the following metadata:
   * originalname: Nome of the file on the user's computer
   * filename: The name of the file within the destination (diskstorage)
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
