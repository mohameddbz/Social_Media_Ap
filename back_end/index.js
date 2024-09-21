import  express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.js";
//import commentRouter from "./routes/comments.js";
//import likeRouter from "./routes/likes.js";
import postRouter from "./routes/posts.js";
//import userRouter from "./routes/users.js";

// midllwar 
app.use((req, res, next) => {Infinity
    res.header("Access-Control-Allow-Credentials", true);
    next();
  }); // should start with it 
  
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
app.use(cookieParser());


app.use("/api/auth",authRouter);
//app.use("/api/comment",commentRouter);
//app.use("/api/like",likeRouter);
app.use("/api/posts",postRouter);
//app.use("/api/user",userRouter);


app.listen(8800,()=>{
    console.log("API working !!");
});