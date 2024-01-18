import viewsService from '../services/views.service.js';

const viewsController = {
  renderLogin: (req, res) => {
    viewsService.renderLogin(req, res);
  },

  renderSignup: (req, res) => {
    viewsService.renderSignup(req, res);
  },

  renderProfile: (req, res) => {
    viewsService.renderProfile(req, res);
  },

  loggerTest: (req, res) => {
    viewsService.loggerTest(req, res);
  }

};

export default viewsController;
