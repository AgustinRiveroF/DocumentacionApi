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

documents: async (req, res) => {
    const { id } = req.body;
    console.log(req.files);
    const { dni, address, bank } = req.files;
    const response = await usersService.documents({ id, dni, address, bank });
    //res.json({ response });
    res.render("documents")
}, 

};


export default usersController;