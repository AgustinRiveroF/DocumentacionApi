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
  },

  forgottenPassword: (req, res) => {
    viewsService.forgottenPassword(req, res);
  },

  recoverPassword: (req, res) => {
    viewsService.recoverPassword(req, res);
  },

  recoverPasswordWithEmail: (req, res) => {
    viewsService.recoverPasswordWithEmail(req, res);
  },

  ahorasi: (req, res) => {
    viewsService.ahorasi(req, res);
  },

  documents: (req, res) => {
    viewsService.documents(req, res);
},
};

export default viewsController;
