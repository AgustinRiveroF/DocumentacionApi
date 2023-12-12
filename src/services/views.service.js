const viewsService = {
    renderLogin: (req, res) => {
      if (req.session.user) {
        console.log('Redirigiendo desde service');
        return res.redirect('/api/products');
      }
      res.render('login');
    },
  
    renderSignup: (req, res) => {
      res.render('signup');
    },
  
    renderProfile: (req, res) => {
      if (!req.session.passport) {
        return res.redirect('views/login');
      }
      res.render('profile', { user: req.user });
    },
  };
  
  export default viewsService;
  