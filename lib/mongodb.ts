import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing environment variable: MONGODB_URI');
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Augment the global object so the cache survives Next.js hot reloads in development.
// In production each module is imported once, so the global is simply a namespace here.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = (global._mongooseCache ??= {
  conn: null,
  promise: null,
});

/**
 * Returns a cached Mongoose instance, creating one if none exists.
 * Call this at the top of every Route Handler or Server Action that needs the DB.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection immediately
  if (cached.conn) return cached.conn;

  // Reuse an in-flight connection promise to avoid opening duplicate connections
  // when multiple requests arrive before the first one resolves
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false, // fail fast if the DB is unreachable instead of buffering
      })
      .catch((err) => {
        // Reset so the next call retries rather than awaiting a rejected promise forever
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
