// Middleware de autenticacion

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'User not authenticated' });
};

export default isAuthenticated;
