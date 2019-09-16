/**
 * Middleware to check and set the default application pagination
 * @author Leonardo Otoni
 */
export default (req, res, next) => {
  /**
   * Default values. Page if not provided will be always 1.
   */
  const { page = 1 } = req.query;
  const limit = 20;

  const offset = (page - 1) * limit;
  req.limit = limit;
  req.offset = offset;
  return next();
};
