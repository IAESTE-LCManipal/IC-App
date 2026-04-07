import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

const f = createUploadthing();

export const ourFileRouter = {
  attendanceUploader: f({ pdf: { maxFileSize: "4MB" }, image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      if (!session) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        fileUrl: file.url,
        userId: metadata.userId,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;