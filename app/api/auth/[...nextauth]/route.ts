//api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/db/mongoose";
import Intern from "@/app/api/models/intern";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        internID: { label: "Intern ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.internID || !credentials?.password) {
          throw new Error("Please enter your intern ID and password");
        }

        await dbConnect();

        const intern = await Intern.findOne({ internID: credentials.internID });

        if (!intern) {
          throw new Error("No intern found with this ID");
        }

        const isPasswordValid = await compare(credentials.password, intern.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: intern._id.toString(),
          internID: intern.internID,
          name: intern.fullName,
          image: intern.photoUrl,
          startDate: intern.startDate,
          endDate: intern.endDate,
          professorDetails: intern.professorDetails
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.internID = user.internID;
        token.startDate = user.startDate;
        token.endDate = user.endDate;
        token.professorDetails = user.professorDetails;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.internID = token.internID;
        session.user.startDate = token.startDate;
        session.user.endDate = token.endDate;
        session.user.professorDetails = token.professorDetails;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
