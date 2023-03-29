import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: `request successfull`, data: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { userName, phoneNumber, password, role } = req.body;

  if (!(userName && phoneNumber && role)) {
    return res.status(200).json({ message: `all input required` });
  }

  const existUser = await User.findOne({ phoneNumber: phoneNumber });

  if (existUser) {
    return res
      .status(400)
      .json({ message: `with ${phoneNumber} already exist` });
  }

  const saltRounds = 10;
  const hashPassword = bcrypt.hashSync(password, saltRounds);

  const payload = {
    userName,
    phoneNumber,
    password: hashPassword,
    role,
  };

  try {
    const user = await User.create(payload);
    res.status(200).json({ message: `user Created Sucessfully`, data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!(phoneNumber && password)) {
      return res.status(200).json({ message: `all input are requires` });
    }

    const user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      return res.status(400).json({ message: `user Does not exit` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: `phoneNumber and password does not match` });
    }

    const token = jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
        userName: user.userName,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .json({ message: `user Sucessfully loging`, data: user, token: token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getAllUsers, createUser, login };
