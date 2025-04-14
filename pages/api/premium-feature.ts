import withAuth from '@/lib/withAuth';

const handler = async (req, res) => {
  // Example protected route logic
  res.status(200).json({ message: 'Welcome to the premium feature!' });
};

export default withAuth(handler);