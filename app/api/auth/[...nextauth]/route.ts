//api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/db/mongoose";
import Intern from "@/app/api/models/intern";
import LC from "@/app/api/models/lc";
import Admin from "@/app/api/models/admin";
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Extract the NextAuth options object for export
const authOptions: NextAuthOptions = {
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
    }),
    // Admin Credentials
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }
        await dbConnect();
        const admin = await Admin.findOne({ email: credentials.email });
        if (!admin) {
          throw new Error("No admin found with this email");
        }
        const isPasswordValid = credentials.password === admin.password;
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return {
          id: admin._id.toString(),
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: "admin"
        };
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        if ((user as any).role === "intern") {
          token.internID = (user as any).internID;
          token.startDate = (user as any).startDate;
          token.endDate = (user as any).endDate;
          token.professorDetails = (user as any).professorDetails;
        }
        if ((user as any).role === "lc") {
          token.email = (user as any).email;
          token.firstName = (user as any).firstName;
          token.lastName = (user as any).lastName;
          token.sroSlot = (user as any).sroSlot;
          token.internsAssigned = (user as any).internsAssigned;
        }
        if ((user as any).role === "admin") {
          token.email = (user as any).email;
          token.firstName = (user as any).firstName;
          token.lastName = (user as any).lastName;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        if (token.role === "intern") {
          (session.user as any).internID = token.internID;
          (session.user as any).startDate = token.startDate;
          (session.user as any).endDate = token.endDate;
          (session.user as any).professorDetails = token.professorDetails;
        }
        if (token.role === "lc") {
          (session.user as any).email = token.email;
          (session.user as any).firstName = token.firstName;
          (session.user as any).lastName = token.lastName;
          (session.user as any).sroSlot = token.sroSlot;
          (session.user as any).internsAssigned = token.internsAssigned;
        }
        if (token.role === "admin") {
          (session.user as any).email = token.email;
          (session.user as any).firstName = token.firstName;
          (session.user as any).lastName = token.lastName;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { authOptions };
export { handler as GET, handler as POST };
