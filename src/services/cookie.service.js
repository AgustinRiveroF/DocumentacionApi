const cookieService = {
    setSessionData: (req, name, email) => {
      req.session.name = name;
      req.session.email = email;
    },
  };
  
  export default cookieService;
  