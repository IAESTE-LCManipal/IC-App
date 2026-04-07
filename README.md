# IAESTE LCMU InternApp

A modern, full-featured web application for managing IAESTE internships at Manipal University. Built with Next.js, TypeScript, Tailwind CSS, and MongoDB, it streamlines the workflow for interns, Local Committee (LC) members, and Incoming Co-ordinators.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The IAESTE LCMU InternApp is designed to simplify and digitize the management of international internships. It provides dashboards and tools for:
- Interns: Access essential info, discounts, emergency contacts, and more.
- LC Members: Manage intern checklists, slots, and local operations.
- Admins: Oversee all users, slots, and statistics.

## Features
- **Role-based dashboards** for Interns, LCs, and Admins
- **Intern SRO Checklist**: Track onboarding and compliance
- **Slot Management**: Assign and monitor internship slots
- **Emergency & Essentials**: Quick access to vital info
- **Discounts & Nearby**: Explore local offers and places
- **Authentication**: Secure login for all roles
- **Progressive Web App (PWA)** support
- **Responsive UI**: Mobile-first, accessible design

## Tech Stack
- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB (via Mongoose)
- **Auth**: next-auth
- **UI**: Shadcn UI, Lucide Icons, Framer Motion
- **PWA**: next-pwa

## Folder Structure
```
app/                # Main app pages and API routes
  api/              # REST API endpoints (admins, interns, lcs, slots, etc.)
  dashboard/        # User dashboards
  ...
components/         # Reusable React components (admin, intern, lc, ui)
hooks/              # Custom React hooks
lib/                # Utilities and database helpers
public/             # Static assets (images, icons, manifest)
```

## Getting Started
1. **Install dependencies:**
   ```bash
   pnpm install
   # or npm install, yarn install, bun install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in required values (MongoDB URI, Auth secrets, etc.)
3. **Run the development server:**
   ```bash
   pnpm dev
   # or npm run dev, yarn dev, bun dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- **Interns**: Sign in to view your dashboard, checklists, essentials, and more.
- **LCs/Admins**: Access management dashboards, update checklists, assign slots, and view statistics.
- **PWA**: Install the app on your device for offline access.

## Contributing
1. Fork this repo and create a feature branch.
2. Add/modify code with clear documentation (use JSDoc/TSDoc for TypeScript).
3. Run `pnpm lint` and ensure all checks pass.
4. Submit a pull request with a clear description.

## License
This project is for IAESTE Manipal University use. Contact the maintainers for licensing details.

---

> For more details, see the codebase and inline documentation.


```markdown
# 📘 Attendance Upload Automation System

## 🎯 Overview
This system allows interns to upload attendance sheets that are:
- Stored in cloud storage  
- Logged in a database  
- Automatically emailed to Finance IC  

---

## 🧱 System Architecture

```

Intern Dashboard (Frontend)
↓
UploadThing (File Storage)
↓
API Route (/api/attendance/upload)
↓
MongoDB (Attendance Record)
↓
Nodemailer (Email Notification)

````

---

## ⚙️ Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Next.js API Routes
- **Database:** MongoDB Atlas
- **File Storage:** UploadThing
- **Authentication:** NextAuth.js
- **Email Service:** Nodemailer (Gmail SMTP)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/internapp

UPLOADTHING_TOKEN=your_uploadthing_token

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FINANCE_EMAIL=finance@yourorg.com
````

---

## 🗄️ Database Schema

### Collection: `attendance`

```json
{
  "internId": "ObjectId",
  "fileUrl": "string",
  "slotId": "ObjectId (optional)",
  "uploadedAt": "Date"
}
```

---

## 🔑 Implementation Steps

### 1. MongoDB Setup

* Create cluster on MongoDB Atlas
* Add IP whitelist: `0.0.0.0/0`
* Create database: `internapp`
* Add connection string to `.env.local`

---

### 2. Authentication Setup

* Use NextAuth CredentialsProvider
* Ensure correct field naming:

  ```
  internID (case-sensitive)
  ```
* Store passwords using bcrypt hashing

---

### 3. UploadThing Setup

* Configure uploader in:

  ```
  app/api/uploadthing/core.ts
  ```
* Use `UPLOADTHING_TOKEN` (base64), not API key

---

### 4. Attendance API

📁 `app/api/attendance/upload/route.ts`

Responsibilities:

* Save attendance record
* Trigger email notification

Key practices:

* Handle errors properly
* Do not crash API if email fails

---

### 5. Email Configuration

📁 `lib/sendFinanceEmail.ts`

SMTP Configuration:

```ts
host: "smtp.gmail.com",
port: 465,
secure: true
```

Important:

* Enable Gmail 2FA
* Use App Password (NOT regular password)

---

### 6. Frontend Integration

📁 `components/intern/interndash.tsx`

Use session for intern ID:

```ts
const { data: session, status } = useSession();

if (status === "loading") return null;

const internId = session?.user?.id;
```

---

## 🧪 Final Workflow

1. Intern logs in
2. Uploads attendance file
3. File stored via UploadThing
4. API receives file URL
5. MongoDB stores attendance record
6. Email sent to Finance IC

---

## 📊 Data Flow

```
Upload Button
   ↓
UploadThing → returns file URL
   ↓
POST /api/attendance/upload
   ↓
MongoDB (attendance collection)
   ↓
Nodemailer → Finance Email
```

---

## 📬 Email Details

| Field    | Value                 |
| -------- | --------------------- |
| Sender   | EMAIL_USER            |
| Receiver | FINANCE_EMAIL         |
| Content  | File link + intern ID |

---

## ⚠️ Common Issues & Fixes

### ❌ MongoDB Connection Error

* Check `MONGODB_URI`
* Ensure IP whitelist is enabled

---

### ❌ Login Fails

* Ensure `internID` field matches exactly
* Password must be bcrypt hashed

---

### ❌ UploadThing Token Error

* Use `UPLOADTHING_TOKEN`
* Do NOT use API key

---

### ❌ ObjectId Cast Error

* Use real MongoDB `_id` from session
* Avoid dummy values like `"test-id"`

---

### ❌ Email Fails

* Use Gmail App Password
* Ensure `.env.local` is loaded
* Restart server after changes

---

## 🚀 Deployment Notes

* Never commit `.env.local`
* Rotate credentials regularly
* Use production email service (Resend/SendGrid recommended)
* Replace deprecated UploadThing `file.url` → `file.ufsUrl`

---

## 🔮 Future Improvements

* Finance dashboard for viewing uploads
* Upload status tracking
* Deadline enforcement
* Multiple uploads per slot
* Replace Gmail with scalable email provider

---

## 👨‍💻 Contributors

* Built and configured for IC-App automation system