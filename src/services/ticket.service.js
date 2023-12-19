import Ticket from "../dao/models/ticket.model.js";

const ticketService = {
  createTicket: async (ticketData) => {
    try {
      const ticket = new Ticket(ticketData);
      await ticket.save();
      return ticket;
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      throw error;
    }
  },
};

export default ticketService;

