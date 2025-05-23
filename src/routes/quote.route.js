
import express from "express";

import { createNewQuote,getAllQuoteRevisions} from "../controllers/quote.controller.js";

const router = express.Router();


router.post("/create-new-quote",createNewQuote);

router.get("/get-all-quote-revisions/:enqueryId",getAllQuoteRevisions);

export default router;



