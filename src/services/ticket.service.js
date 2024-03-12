import Ticket from "../dao/models/ticket.model.js";

const ticketService = {
  createTicket: async (userId, ticketData) => {
    try {
      const ticket = new Ticket({ ...ticketData, userId });
      await ticket.save();
      return ticket;
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      throw error;
    }
  },

  getTickets: async () => {
    try {
      const tickets = await Ticket.find();
      return tickets;
    } catch (error) {
      console.error('Error al obtener todos los tickets:', error);
      throw error;
    }
  },
  
  getTicketById: async (ticketId) => {
    try {
      const ticket = await Ticket.findById(ticketId);
      return ticket;
    } catch (error) {
      console.error('Error al obtener el ticket por ID:', error);
      throw error;
    }
  },
  
  getTicketByUserId: async (userId) => {
    try {
      const ticket = await Ticket.findOne({ userId });
      return ticket;
    } catch (error) {
      console.error('Error al obtener el ticket por ID de usuario:', error);
      throw error;
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      const result = await Ticket.findByIdAndDelete(ticketId);
      return result;
    } catch (error) {
      console.error('Error al eliminar el ticket por ID:', error);
      throw error;
    }
  },

  
};

export default ticketService;

