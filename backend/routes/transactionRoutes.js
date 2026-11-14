import express from "express";
import {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTransactions).post(createTransaction);

router.route("/:id").get(getTransactionById).put(updateTransaction);

export default router;
