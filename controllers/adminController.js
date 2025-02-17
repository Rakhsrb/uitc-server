import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import generateToken from "../middlewares/generateToken.js";

const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

// GetAllAccounts
export const GetAllAccounts = async (_, res) => {
  try {
    const admins = await Admin.find();
    return res.status(200).json({ data: admins, total: admins.length });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  get Admin
export const GetAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    return res.status(200).json({ data: admin });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// create Account
export const CreateAccount = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existedAdmin = await Admin.findOne({ email });
    if (existedAdmin) {
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    const token = generateToken({ id: newAdmin._id });

    return res.status(201).json({
      message: "New admin created!",
      data: newAdmin,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  LoginToAccount
export const LoginToAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return sendErrorResponse(
        res,
        401,
        "Admin with this email does not exist."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, "Incorrect email or password.");
    }

    const token = generateToken({ _id: admin._id });

    return res.status(200).json({
      message: "Success!",
      token,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error.");
  }
};

// DeleteAccount
export const DeleteAccount = async (req, res) => {
  try {
    const removedAdmin = await Admin.findByIdAndDelete(req.params.id);
    res.json({
      data: removedAdmin,
      message: "Admin has been deleted successfully!",
    });
  } catch (err) {
    res.json({ message: err });
  }
};

// updateAccount
export const UpdateAccount = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const id = req.params.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { name, email, password: hashedPassword },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found!" });
    }
    return res.status(200).json({
      message: "Admin updated successfully!",
      data: updatedAdmin,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetMe = async (req, res) => {
  try {
    const foundUser = await Admin.findById(req.userInfo.userId);
    if (!foundUser) return res.status(404).json({ message: "User not found!" });
    return res.status(200).json({ data: foundUser });
  } catch (error) {
    return res.status(500).json({ message: "user not found" });
  }
};
