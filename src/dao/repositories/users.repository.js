import { usersModel } from '../models/users.model.js';

class UsersRepository {
  async getById(userId) {
    return usersModel.findById(userId);
  }

  async getByEmail(email) {
    return usersModel.findOne({ email });
  }

  async createUser(user) {
    return usersModel.create(user);
  }

}

export default new UsersRepository();
