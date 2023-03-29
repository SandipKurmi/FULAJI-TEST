import Product from "../models/product.js";
import fs from "fs";
const directoryPath = "/images/";

const createProduct = async (req, res) => {
  let imageFileName = [];
  if (req.files.length) {
    req.files?.forEach((file) => {
      imageFileName.push(file.filename);
    });
  }

  try {
    const requiredFields = ["name", "size", "colour", "price", "quantaty"];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(200).json({
        message: `missing required field: ${missingFields.join(", ")}`,
      });
    }

    const payload = {
      name: req.body.name,
      size: req.body.size,
      images: imageFileName,
      colour: req.body.colour,
      price: req.body.price,
      quantaty: req.body.quantaty,
    };

    const product = await Product.create(payload);

    res.status(200).json({ message: `request Sucessfully`, data: product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const porduct = await Product.findById(id);
    res.status(200).json({ message: `request Sucessfully`, data: porduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getAllProduct = async (req, res) => {
  let { skip, limit, search = null } = req?.query;
  skip = skip ? Number(skip) : 1;
  limit = limit ? Number(limit) : 10;
  skip = (skip - 1) * limit;

  delete req.query.skip;
  delete req.query.limit;

  if (search != null) {
    req.query["$or"] = [{ name: { $regex: new RegExp(search, "i") } }];
  }

  try {
    const porduct = await Product.find(req.query)
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });
    const total = await Product.countDocuments(req.query);
    res
      .status(200)
      .json({ message: `request Sucessfully`, total, data: porduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const requiredFields = ["name", "size", "colour", "price", "quantaty"];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(200).json({
        message: `missing required field: ${missingFields.join(", ")}`,
      });
    }

    const { id } = req.params;

    const oldUser = await Product.findOne({ _id: id });

    if (oldUser.images) {
      new Promise((resolve, reject) => {
        oldUser?.images?.forEach((image) => {
          fs.unlink(process.cwd() + directoryPath + image, (err) => {
            if (err) {
              reject({
                error: true,
                message: "Error deleting file",
                statusCode: 500,
                data: null,
              });
            } else {
              resolve();
            }
          });
        });
      });
    }

    let imageFileName = [];
    if (req.files.length) {
      req.files?.forEach((file) => {
        imageFileName.push(file.filename);
      });
    }

    const payload = {
      name: req.body.name,
      size: req.body.size,
      images: imageFileName,
      colour: req.body.colour,
      price: req.body.price,
      quantaty: req.body.quantaty,
    };
    const porduct = await Product.findByIdAndUpdate(id, payload, { new: true });

    res.status(200).json({ message: `Updated Sucessfully`, data: porduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const porduct = await Product.findByIdAndDelete(id);

    res.status(200).json({ message: `Deleted Sucessfully`, data: porduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createProduct,
  getSingleProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
