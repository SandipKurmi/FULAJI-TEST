import Order from "../models/order.js";
import uniqid from "uniqid";

const createOrder = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const requiredField = ["product_id", "user_id"];
    const matchingField = requiredField.filter((field) => !req.body[field]);

    if (matchingField?.length > 0) {
      return res.status(200).json({
        message: `missing required field: ${matchingField.join(", ")}`,
      });
    }

    const payload = {
      user_id: user_id,
      product_id: product_id,
      order_code: uniqid(),
      order_data: new Date(),
      shipping_Date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    };

    const order = await Order.create(payload);

    res.status(200).json({ message: `request Sucessfully`, data: order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllOrder = async (req, res) => {
  let query = req.query;
  let { skip, limit, search = null } = query;
  skip = skip ? Number(skip) : 1;
  limit = limit ? Number(limit) : 10;
  skip = (skip - 1) * limit;

  delete query.skip;
  delete query.limit;
  delete query.search;

  if (search != "") {
    query["$or"] = [
      { "user_id.userName": { $regex: new RegExp(search, "i") } },
      { "product_id.name": { $regex: new RegExp(search, "i") } },
    ];
  }

  try {
    const orders = await Order.find(query)
      .populate("product_id")
      .populate("user_id", "-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res
      .status(200)
      .json({ message: `request Sucessfully`, total, data: orders });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    res.status(200).json({ message: `request Sucessfully`, data: order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json({ message: `record delete Sucessfully`, data: order });
  } catch (error) {
    req.status(200).json({ message: error.message });
  }
};

export { createOrder, getAllOrder, getSingleOrder, deleteSingleOrder };
