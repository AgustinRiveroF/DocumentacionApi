import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true,
    },
    product_price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
    },
    owner: {
        type: String,
        default: "admin",
        ref: "Users",
    }
});

export const productModel = mongoose.model("Product", productSchema);