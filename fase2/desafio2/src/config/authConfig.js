/**
 * config data for JWT token generation
 * @author Leonardo Otoni
 */
export default {
  secret: process.env.SERVER_KEY,
  expiresIn: '1d',
};
