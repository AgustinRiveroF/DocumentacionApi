const logoutService = {
    destroySession: (req) => {
      return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            console.error('Error al destruir la sesión:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },
  };
  
  export default logoutService;
  