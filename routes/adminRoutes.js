import express from "express";
import {
  CreateAccount,
  DeleteAccount,
  GetAdminById,
  GetAllAccounts,
  GetMe,
  LoginToAccount,
  UpdateAccount,
} from "../controllers/adminController.js";
import isExisted from "../middlewares/isExisted.js";

const router = express.Router();

router.get("/me", isExisted, GetMe);
router.get("/", GetAllAccounts);
router.get("/:id", GetAdminById);
router.post("/login", LoginToAccount);
router.post("/create", CreateAccount);
router.delete("/delete/:id", DeleteAccount);
router.put("/update/:id", UpdateAccount);

export default router;
