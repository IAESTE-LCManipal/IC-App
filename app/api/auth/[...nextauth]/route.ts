//api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/db/mongoose";
import Intern from "@/app/api/models/intern";
import LC from "@/app/api/models/lc";

const handler = NextAuth({
  providers: [
    // Intern Credentials
    CredentialsProvider({
      id: "intern-credentials",
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
          professorDetails: intern.professorDetails,
          role: intern.role // 'intern'
        };
      }
    }),
    // LC Credentials
    CredentialsProvider({
      id: "lc-credentials",
      name: "LC Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }
        await dbConnect();
        const lc = await LC.findOne({ email: credentials.email });
        if (!lc) {
          throw new Error("No LC found with this email");
        }
        const isPasswordValid = await compare(credentials.password, lc.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return {
          id: lc._id.toString(),
          email: lc.email,
          firstName: lc.firstName,
          lastName: lc.lastName,
          sroSlot: lc.sroSlot,
          internsAssigned: lc.internsAssigned,
          role: lc.role // 'lc'
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Store user role
        if (user.role === "intern") {
          token.internID = user.internID;
          token.startDate = user.startDate;
          token.endDate = user.endDate;
          token.professorDetails = user.professorDetails;
        }
        if (user.role === "lc") {
          token.email = user.email;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.sroSlot = user.sroSlot;
          token.internsAssigned = user.internsAssigned;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        if (token.role === "intern") {
          session.user.internID = token.internID;
          session.user.startDate = token.startDate;
          session.user.endDate = token.endDate;
          session.user.professorDetails = token.professorDetails;
        }
        if (token.role === "lc") {
          session.user.email = token.email;
          session.user.firstName = token.firstName;
          session.user.lastName = token.lastName;
          session.user.sroSlot = token.sroSlot;
          session.user.internsAssigned = token.internsAssigned;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin"
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
