module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('subscriptions', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        meetup_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'meetups',
            key: 'id',
          },
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        version: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      })
      .then(() =>
        queryInterface.addIndex('subscriptions', ['user_id'], {
          name: 'subscription_userId',
        })
      )
      .then(() =>
        queryInterface.addIndex('subscriptions', ['meetup_id', 'user_id'], {
          name: 'subscription_meetupdId_userId',
          type: 'UNIQUE',
        })
      );
  },

  down: queryInterface => {
    return queryInterface.dropTable('subscriptions');
  },
};
