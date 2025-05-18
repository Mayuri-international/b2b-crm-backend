
import express from "express";

import { createUser,getAllSalesPerson,assignPersonToEnquery } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/create-user",createUser);

router.get("/get-all-sales-person",getAllSalesPerson);

router.post("/assign-person-to-enquery",assignPersonToEnquery);

export default router;

