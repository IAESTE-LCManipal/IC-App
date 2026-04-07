"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function AttendanceUpload({
  internId,
  slotId,
}: {
  internId: string;
  slotId: string;
}) {
  return (
    <div className="p-4 border rounded-xl">
      <UploadButton<OurFileRouter>
        endpoint="attendanceUploader"
        onClientUploadComplete={async (res) => {
          const fileUrl = res[0].url;

          await fetch("/api/attendance/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              internId,
              slotId,
              fileUrl,
            }),
          });

          alert("Uploaded & sent to finance ✅");
        }}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}