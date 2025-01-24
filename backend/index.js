import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import postRoute from "./routes/post.route.js";
import dotenv from 'dotenv';
import path from 'path';
import { app,server } from "./socket/socket.js";

dotenv.config();




// Set PORT variable
const PORT = process.env.PORT || 3000; // Use port 3000 or environment port


const __dirname = path.resolve();
// Properly use express.urlencoded


// Route
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "from backend",
        success: true
    });
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));

//api 


app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})


// Start server
server.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at ${PORT}`);
});
