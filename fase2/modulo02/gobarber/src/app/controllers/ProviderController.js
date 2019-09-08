import User from '../models/User';
import File from '../models/File';

/**
 * Handle all Users having a Provider status
 * @author Leonardo Otoni
 */
class Provider {
  /**
   * List all Providers
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const providers = await User.findAll({
      where: {
        provider: true,
      },
      attributes: ['id', 'name', 'email'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });
    return res.json(providers);
  }
}

export default new Provider();
