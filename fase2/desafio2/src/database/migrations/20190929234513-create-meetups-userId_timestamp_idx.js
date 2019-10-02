module.exports = {
  up: queryInterface => {
    return queryInterface.addIndex('meetups', ['user_id', 'timestamp'], {
      name: 'meetups_userId_timestamp',
      type: 'UNIQUE',
    });
  },

  down: queryInterface => {
    return queryInterface.removeIndex('meetups', 'meetups_userId_timestamp');
  },
};
