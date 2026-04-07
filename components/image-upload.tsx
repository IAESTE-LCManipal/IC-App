"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function ImageUpload({
  internId,
  slotId,
}: {
  internId: string;
  slotId: string;
}) {
  return (
    <div className="p-4 border rounded-xl flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Upload Attendance</h2>

      <UploadButton<OurFileRouter>
        endpoint="attendanceUploader"
        onClientUploadComplete={async (res) => {
          try {
            const fileUrl = res?.[0]?.url;

            if (!fileUrl) {
              alert("Upload failed ❌");
              return;
            }

            const response = await fetch("/api/attendance/upload", {
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

            const data = await response.json();

            if (data.success) {
              alert("Attendance uploaded & sent to finance ✅");
            } else {
              alert("Saved but email failed ⚠️");
            }
          } catch (err) {
            console.error(err);
            alert("Something went wrong ❌");
          }
        }}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}