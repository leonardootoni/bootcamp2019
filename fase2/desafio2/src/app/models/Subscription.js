import Sequelize, { Model } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init({}, { sequelize });
    return this;
  }

  /**
   * Create entity associations
   * @param {Object} models - Sequelize Loaded Models
   */
  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id', as: 'meetup' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Subscription;
