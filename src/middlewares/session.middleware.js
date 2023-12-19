// session middleware


export const sessionInfo = (req, res, next) => {
    try {

      const user = req.session.passport ? req.session.passport.user : null;
      if (user) {
        res.locals.userEmail = user.email;
        res.locals.userId = user.id;
      }
      next();
    } catch (error) {
      console.error('Error en el middleware sessionInfo:', error);
      next(error);
    }
  };
  