import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/db/mongoose";
import Intern from "@/app/api/models/intern";
import LC from "@/app/api/models/lc";
import Admin from "@/app/api/models/admin";
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Define separate types for each user role

type InternUser = {
  id: string;
  role: 'intern';
  internID: string;
  startDate: string;
  endDate: string;
  professorDetails: unknown;
  name: string;
  image: string;
};

type LCUser = {
  id: string;
  role: 'lc';
  email: string;
  firstName: string;
  lastName: string;
  sroSlot: string;
};

type AdminUser = {
  id: string;
  role: 'admin';
  email: string;
  firstName: string;
  lastName: string;
};

type UserWithRole = InternUser | LCUser | AdminUser;

export const authOptions: NextAuthOptions = {
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
        const u = user as UserWithRole;
        token.id = u.id;
        token.role = u.role;
        if (u.role === "intern") {
          token.internID = u.internID;
          token.startDate = u.startDate;
          token.endDate = u.endDate;
          token.professorDetails = u.professorDetails;
        }
        if (u.role === "lc") {
          token.email = u.email;
          token.firstName = u.firstName;
          token.lastName = u.lastName;
          token.sroSlot = u.sroSlot;
        }
        if (u.role === "admin") {
          token.role = u.role;
          token.email = u.email;
          token.firstName = u.firstName;
          token.lastName = u.lastName;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        const user = session.user as Record<string, unknown>;
        user.id = token.id;
        user.role = token.role;
        if (token.role === "intern") {
          user.internID = token.internID;
          user.startDate = token.startDate;
          user.endDate = token.endDate;
          user.professorDetails = token.professorDetails;
        }
        if (token.role === "lc") {
          user.email = token.email;
          user.firstName = token.firstName;
          user.lastName = token.lastName;
          user.sroSlot = token.sroSlot;
        }
        if (token.role === "admin") {
          user.email = token.email;
          user.firstName = token.firstName;
          user.lastName = token.lastName;
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
