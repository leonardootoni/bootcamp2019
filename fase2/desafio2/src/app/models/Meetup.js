import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        timestamp: Sequelize.DATE,
      },
      { sequelize }
    );

    return this;
  }

  /**
   * Create entity associations
   * @param {Object} models - Sequelize Loaded Models
   */
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'file_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Meetup;
