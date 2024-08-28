import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongo_uri = process.env.MONGODB_URI;

    if (mongo_uri) {
      const connectionInstance = await mongoose.connect(mongo_uri);
      console.log(
        `\n MogoDB connected ! ! DB HOST: ${connectionInstance.connection.host}`
      );
    }
  } catch (error) {
    const err: Error = error as Error;
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

export { connectDB };
