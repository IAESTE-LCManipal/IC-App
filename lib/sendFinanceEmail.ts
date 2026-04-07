import nodemailer from "nodemailer";

export async function sendToFinance({
  fileUrl,
  internId,
}: {
  fileUrl: string;
  internId: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // VERY IMPORTANT
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Intern App" <${process.env.EMAIL_USER}>`,
      to: process.env.FINANCE_EMAIL,
      subject: "New Attendance Submission",
      html: `
        <h3>New Attendance Uploaded</h3>
        <p><strong>Intern ID:</strong> ${internId}</p>
        <a href="${fileUrl}">View File</a>
      `,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
}