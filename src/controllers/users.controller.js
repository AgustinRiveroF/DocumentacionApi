import usersService from "../services/user.service.js";

const usersController = {

infoRole: (req, res) => {
    usersService.infoRole(req, res);
},

changeRole: (req, res) => {
    usersService.changeRole(req, res);
},

premium: (req, res) => {
    usersService.premium(req, res);
},

}


export default usersController;