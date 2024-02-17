// session middleware

export const sessionInfo = (req, res, next) => {
  try {
    if (!req.session || !req.session.passport || !req.session.passport.user || !req.session.passport.user.email) {
      console.log('No hay un usuario en la session');
      return res.render('sessionExpired');
    }
    next();
  } catch (error) {
    console.error('Error en el middleware sessionInfo:', error);
    next(error);
  }
};

  