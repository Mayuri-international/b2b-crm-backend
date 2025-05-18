
import express from "express";

import createNewQuote from "../controllers/quote.controller.js";

const router = express.Router();


router.post("/create-new-quote",createNewQuote);

export default router;

