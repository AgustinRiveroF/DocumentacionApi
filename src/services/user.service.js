import { usersManager } from "../dao/managers/users.dao.js";

const usersService = {

    documents: async (req, dni, address, bank) => {
        const  id  = req.id;
        const savedDocuments = await usersManager.updateOne(id, {
            documents: [
                {
                    name: 'dni',
                    reference:req.dni[0].path,
                },
                {
                    name: 'address',
                    reference:req.address[0].path,
                },
                {
                    name: 'bank',
                    reference:req.bank[0].path,
                },
            ],
        });
        return savedDocuments;
    }, 
};

export default usersService;    