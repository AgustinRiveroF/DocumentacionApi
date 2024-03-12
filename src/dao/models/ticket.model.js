import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    id: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    code: { 
        type: String,
        unique: true,
        required: true 
    },
    purchase_datetime: {
        type: Date,
        default: Date.now 
    },
    amount: { 
        type: Number,
        required: true 
    },
    purchaser: {
        type: String,
        required: true 
    },
    products: [{
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        },
        product_name: {
            type: String,
            required: true
        },
        product_description: {
            type: String,
            required: true
        },
        product_price: {
            type: Number,
            required: true
        }
    }],
})

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
