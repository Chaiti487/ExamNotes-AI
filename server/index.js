import express from "express"
import dotenv from "dotenv"
dotenv.config();
import connect from "./utils/connect.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/user.route.js";

const app = express()
app.use(cors(
  { origin: "http://localhost:5173",
    credentials: true ,
    methods:["GET","POST","PUT","DELETE","OPTIONS"]
   }
  ));
app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5000
app.get("/", (req, res) => {
  res.json({ message: "ExamNotes AI Backend Running" })
})
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
