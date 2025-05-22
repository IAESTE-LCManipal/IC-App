//api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { compare } from "bcryptjs";
// import dbConnect from "@/lib/db/mongoose";
// import Intern from "@/app/api/models/intern";
// import LC from "@/app/api/models/lc";
// import Admin from "@/app/api/models/admin";
import { authOptions } from "../authOptions";

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

// Only export the handler(s)
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
