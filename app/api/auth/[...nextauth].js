import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { dbConnect } from '../utils/dbConnect';
import User from '@/app/models/User';
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user._id, name: user.name, email: user.email };
        }
        throw new Error('Invalid credentials');
      }
    })
  ],
  session: {
    jwt: true
  }
});