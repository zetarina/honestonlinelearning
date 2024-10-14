import mongoose from "mongoose";

// Use MONGODB_URI from env or fallback to local
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/learning-service";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Check if there's an existing connection cached in the global object (for serverless environments)
let cached: MongooseCache = global.mongoose as MongooseCache;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If a connection already exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection is established, start one and cache it
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
