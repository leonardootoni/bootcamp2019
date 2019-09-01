// Sequelize database config file
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'desafio2',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    version: true,
  },
};
