import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;

        // Auto-fix for the rollNo_1 index issue
        try {
            const collection = mongoose.connection.collection('students');
            const indexes = await collection.indexes();
            const rollNoIndex = indexes.find(idx => idx.name === 'rollNo_1');

            if (rollNoIndex) {
                console.log('Legacy rollNo_1 index detected. Dropping permanently...');
                await collection.dropIndex('rollNo_1');
                console.log('rollNo_1 index removed.');
            }
        } catch (indexError) {
            console.error('Error removing rollNo index:', indexError);
            // Don't throw, just log. We don't want to block connection.
        }

    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connect;
