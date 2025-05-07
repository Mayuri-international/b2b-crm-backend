
import express from "express";

const app = express();

app.listen(4000,()=>{

    console.log("app runs at the ",4000);

})

app.get("/",(req,res)=>{

    res.send("hellow  world ");


});

