import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Error:", error.message)
  }
}

export default connect;
