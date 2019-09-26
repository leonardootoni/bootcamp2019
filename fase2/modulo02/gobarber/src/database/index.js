import Sequelize from 'sequelize';
import Mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment];

/**
 * Load the database configuration and initialize declared models
 */
class Database {
  constructor() {
    this.initSQLConnection();
    this.initNoSQLConnection();
  }

  // Starts SQL Connection and Load Mapping Objects
  async initSQLConnection() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // Starts NO-SQL Connection and Load Mapping Objects
  async initNoSQLConnection() {
    this.initNoSQLConnectionConnection = await Mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
