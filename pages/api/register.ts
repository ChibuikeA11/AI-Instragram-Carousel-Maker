import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('next-app');

      // Check if the user already exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      await db.collection('users').insertOne({
        username,
        email,
        passwordHash,
        hasPaid: false,
      });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}