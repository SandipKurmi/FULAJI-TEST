import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    colour: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantaty: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", ProductSchema);
export default productModel;
