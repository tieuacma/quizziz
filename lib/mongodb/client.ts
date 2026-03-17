// lib/mongodb/client.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Vui lòng định nghĩa biến môi trường MONGODB_URI trong file .env.local');
}

// Khai báo kiểu global để tránh lỗi TypeScript khi Hot-reload
let globalWithMongoose = global as typeof global & {
    mongoose: { conn: any; promise: any };
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
    cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

export async function connectToMongoDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = { bufferCommands: false };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}