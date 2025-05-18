
import express from "express";

import clientEnqueryRoutes from "./src/routes/clientEnquery.route.js";

import userRoutes from "./src/routes/user.route.js";

import dbConnnect from "./src/config/db.config.js";

import dotenv from "dotenv";

import cors from "cors";

import quoteRoutes from "./src/routes/quote.route.js";

import { urlencoded } from "express";

import fileUpload from "express-fileupload";


// Load environment variables from .env file

dotenv.config();

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));


app.use(cors({

    origin: "*",

}));

app.listen(4000, () => {

    console.log("app runs at the ", 4000);

})

dbConnnect();


// File Upload
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        limits: { fileSize: 5 * 1024 * 1024 },
        debug: true,
    })
);

app.get("/", (req, res) => {

    res.send("hellow  world ");

});


app.use("/api", clientEnqueryRoutes);

app.use("/api", userRoutes);

app.use("/api", quoteRoutes);

