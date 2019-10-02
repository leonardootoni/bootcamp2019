module.exports = {
  up: queryInterface => {
    return queryInterface.addIndex('meetups', ['user_id'], {
      name: 'meetups_user_id',
    });
  },

  down: queryInterface => {
    return queryInterface.removeIndex('meetups', 'meetups_user_id');
  },
};
