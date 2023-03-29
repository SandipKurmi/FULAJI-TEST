import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    order_code: {
      type: String,
      required: [true, `uniqe order code is required`],
    },
    order_data: {
      type: Date,
      required: [true, `order data is required`],
    },
    shipping_Date: {
      type: Date,
      required: [true, `shipping data is required`],
    },
    order_Status: {
      type: String,
      enum: ["pending", "approve", "dispatch", "delivered"],
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
