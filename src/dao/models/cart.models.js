import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    unique: true,
  },

  products: [
    {
      productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      _id: false,
    },
  ],
}).set('strictPopulate', false);




export const cartsModel = mongoose.model("Carts", cartsSchema);

