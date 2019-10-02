/**
 * Middleware that will compute and set default values for pagination
 * @author Leonardo Otoni
 */
export default (req, res, next) => {
  const { page = 1 } = req.query;
  const defaultPage = page > 0 ? page : 1;
  req.limit = process.env.PAGE_SIZE;
  req.offset = (defaultPage - 1) * req.limit;

  return next();
};
