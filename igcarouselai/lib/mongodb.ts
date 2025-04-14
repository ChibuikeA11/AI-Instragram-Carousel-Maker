import { MongoClient } from 'mongodb';
import { env } from './env';

const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across module reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(env.MONGODB_URI, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(env.MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;