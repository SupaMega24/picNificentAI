import mongoose, { Mongoose } from "mongoose";


const MONGODBU_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Create cached variable to optimize connections

let cached: MongooseConnection = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODBU_URL) throw new Error('MONGODB_URL is missing');

    cached.promise = cached.promise ||
        mongoose.connect(MONGODBU_URL, {
            dbName: 'picnificentai', bufferCommands: false
        })

    cached.conn = await cached.promise;
    return cached.conn;
}