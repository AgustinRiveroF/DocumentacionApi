import { usersManager } from '../daos/managers/users.dao.js';
import { compareData } from '../utils.js';

const sessionService = {
  getUserByEmail: async (email) => {
    const user = await usersManager.findByEmail(email);
    return user;
  },

  loginUser: async (email, password) => {
    const user = await sessionService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await compareData(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return { email, first_name: user.first_name, role: 'usuario' };
  },

  loginAdmin: (email, password) => {
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      return { email, role: 'admin' };
    }
    return null;
  },
};

export default sessionService;
